"""
Deforestation Detection Web Application
Flask backend for land cover segmentation
"""

from flask import Flask, render_template, request, jsonify, send_file
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

app = Flask(__name__)

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

def preprocess_image(image):
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

def create_overlay(original, mask, alpha=0.6):
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

@app.route('/')
def index():
    """Main page"""
    return render_template('index.html', class_names=class_names)

@app.route('/predict', methods=['POST'])
def predict():
    """Handle image prediction"""
    try:
        # Check if model is loaded
        if model is None:
            return jsonify({'error': 'Model not loaded'}), 500
        
        # Get uploaded file
        if 'image' not in request.files:
            return jsonify({'error': 'No image uploaded'}), 400
        
        file = request.files['image']
        if file.filename == '':
            return jsonify({'error': 'No image selected'}), 400
        
        # Load and preprocess image
        image = Image.open(file.stream)
        original_size = image.size
        
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
        def image_to_base64(img):
            buffer = io.BytesIO()
            img.save(buffer, format='PNG')
            img_str = base64.b64encode(buffer.getvalue()).decode()
            return f"data:image/png;base64,{img_str}"
        
        # Prepare response
        result = {
            'success': True,
            'original_image': image_to_base64(image),
            'segmentation_mask': image_to_base64(Image.fromarray(rgb_mask)),
            'overlay': image_to_base64(overlay),
            'class_percentages': percentages,
            'original_size': original_size,
            'prediction_size': (256, 256)
        }
        
        return jsonify(result)
        
    except Exception as e:
        print(f"Prediction error: {e}")
        return jsonify({'error': str(e)}), 500

@app.route('/model_status')
def model_status():
    """Check if model is loaded"""
    return jsonify({
        'loaded': model is not None,
        'classes': class_names,
        'num_classes': num_classes
    })

@app.route('/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'healthy'})

if __name__ == '__main__':
    # Create models directory if it doesn't exist
    models_dir = Path(__file__).parent.parent / 'models'
    models_dir.mkdir(exist_ok=True)
    
    # Load model
    if load_model():
        print("Starting Flask app...")
        app.run(debug=True, host='0.0.0.0', port=5000)
    else:
        print("Failed to load model. Please ensure the model file exists.")
        print("Expected location: models/deforestation_model.pth")
