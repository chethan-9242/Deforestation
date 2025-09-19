"""
Deforestation Detection API
FastAPI backend for land cover segmentation
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
import torch
import torch.nn as nn
import numpy as np
from PIL import Image
import io
import base64
import cv2
import json
from pathlib import Path
import os
import albumentations as A
from albumentations.pytorch import ToTensorV2
import segmentation_models_pytorch as smp
from typing import Dict, List, Optional
import uvicorn

app = FastAPI(
    title="Deforestation Detection API",
    description="API for land cover segmentation using deep learning",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global variables
model = None
class_dict = {
    'urban': (0, 255, 255),
    'water': (0, 0, 255), 
    'forest': (0, 255, 0),
    'agriculture': (255, 255, 0),
    'road': (255, 0, 255)
}
class_names = list(class_dict.keys())
num_classes = len(class_dict)

# Image preprocessing
transform = A.Compose([
    A.Resize(256, 256),
    A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
    ToTensorV2(),
])

# Pydantic models
class PredictionResponse(BaseModel):
    success: bool
    original_image: str
    segmentation_mask: str
    overlay: str
    class_percentages: Dict[str, float]
    original_size: List[int]
    prediction_size: List[int]

class ModelStatusResponse(BaseModel):
    loaded: bool
    classes: List[str]
    num_classes: int

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool

def load_model():
    """Load the trained model"""
    global model
    model_path = Path(__file__).parent.parent / 'models' / 'deforestation_model.pth'
    
    if not model_path.exists():
        print(f"Model not found at {model_path}")
        return False
    
    try:
        # Load model checkpoint
        checkpoint = torch.load(model_path, map_location='cpu')
        
        # Create model architecture
        model = smp.Unet(
            encoder_name="resnet34",
            encoder_weights=None,  # We'll load our own weights
            in_channels=3,
            classes=num_classes,
            activation=None,
        )
        
        # Load state dict
        model.load_state_dict(checkpoint['model_state_dict'])
        model.eval()
        
        print("Model loaded successfully!")
        return True
    except Exception as e:
        print(f"Error loading model: {e}")
        return False

def preprocess_image(image: Image.Image):
    """Preprocess image for model inference"""
    # Convert PIL to numpy array
    image_np = np.array(image.convert('RGB'))
    
    # Apply transforms
    transformed = transform(image=image_np)
    image_tensor = transformed['image'].unsqueeze(0)  # Add batch dimension
    
    return image_tensor

def postprocess_prediction(prediction):
    """Convert model prediction to colored mask"""
    # Get class predictions
    pred_classes = torch.argmax(prediction, dim=1).squeeze().cpu().numpy()
    
    # Convert to RGB mask
    h, w = pred_classes.shape
    rgb_mask = np.zeros((h, w, 3), dtype=np.uint8)
    
    for i, (class_name, rgb_color) in enumerate(class_dict.items()):
        mask = (pred_classes == i)
        rgb_mask[mask] = rgb_color
    
    return rgb_mask, pred_classes

def create_overlay(original: Image.Image, mask, alpha=0.6):
    """Create overlay of original image and mask"""
    # Resize mask to match original
    mask_resized = cv2.resize(mask, (original.width, original.height))
    
    # Convert PIL to numpy
    original_np = np.array(original)
    
    # Create overlay
    overlay = cv2.addWeighted(original_np, 1-alpha, mask_resized, alpha, 0)
    
    return Image.fromarray(overlay)

def calculate_class_percentages(pred_classes):
    """Calculate percentage of each class"""
    total_pixels = pred_classes.size
    percentages = {}
    
    for i, class_name in enumerate(class_names):
        class_pixels = np.sum(pred_classes == i)
        percentage = (class_pixels / total_pixels) * 100
        percentages[class_name] = round(percentage, 2)
    
    return percentages

def image_to_base64(img: Image.Image) -> str:
    """Convert PIL Image to base64 string"""
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    img_str = base64.b64encode(buffer.getvalue()).decode()
    return f"data:image/png;base64,{img_str}"

# API Routes
@app.get("/", response_model=HealthResponse)
async def root():
    """Root endpoint"""
    return HealthResponse(
        status="healthy",
        model_loaded=model is not None
    )

@app.get("/health", response_model=HealthResponse)
async def health():
    """Health check endpoint"""
    return HealthResponse(
        status="healthy",
        model_loaded=model is not None
    )

@app.get("/model/status", response_model=ModelStatusResponse)
async def model_status():
    """Check if model is loaded and get model info"""
    return ModelStatusResponse(
        loaded=model is not None,
        classes=class_names,
        num_classes=num_classes
    )

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    """Handle image prediction"""
    try:
        # Check if model is loaded
        if model is None:
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read and process image
        contents = await file.read()
        image = Image.open(io.BytesIO(contents))
        original_size = list(image.size)
        
        # Preprocess for model
        input_tensor = preprocess_image(image)
        
        # Make prediction
        with torch.no_grad():
            prediction = model(input_tensor)
        
        # Postprocess prediction
        rgb_mask, pred_classes = postprocess_prediction(prediction)
        
        # Create overlay
        overlay = create_overlay(image, rgb_mask)
        
        # Calculate class percentages
        percentages = calculate_class_percentages(pred_classes)
        
        # Convert images to base64 for web display
        result = PredictionResponse(
            success=True,
            original_image=image_to_base64(image),
            segmentation_mask=image_to_base64(Image.fromarray(rgb_mask)),
            overlay=image_to_base64(overlay),
            class_percentages=percentages,
            original_size=original_size,
            prediction_size=[256, 256]
        )
        
        return result
        
    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/classes")
async def get_classes():
    """Get available classes"""
    return {
        "classes": class_names,
        "class_dict": class_dict,
        "num_classes": num_classes
    }

# Startup event
@app.on_event("startup")
async def startup_event():
    """Load model on startup"""
    print("Starting up...")
    if load_model():
        print("Model loaded successfully!")
    else:
        print("Failed to load model. API will work but predictions will fail.")

if __name__ == "__main__":
    # Create models directory if it doesn't exist
    models_dir = Path(__file__).parent.parent / 'models'
    models_dir.mkdir(exist_ok=True)
    
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
