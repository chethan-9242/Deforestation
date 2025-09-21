import torch
import torch.nn as nn
import os

def optimize_model():
    # Load the original model
    print("Loading original model...")
    model = torch.load('models/deforestation_model.pth', map_location='cpu')
    
    # Get original size
    original_size = os.path.getsize('models/deforestation_model.pth')
    print(f"Original model size: {original_size / (1024*1024):.2f} MB")
    
    # Optimize the model
    print("Optimizing model...")
    
    # Set model to evaluation mode
    if hasattr(model, 'eval'):
        model.eval()
    
    # Quantize the model (reduce precision)
    try:
        # Convert to half precision (16-bit)
        model = model.half()
        print("✓ Converted to half precision")
    except:
        print("⚠ Could not convert to half precision, keeping original")
    
    # Save optimized model
    print("Saving optimized model...")
    torch.save(model, 'models/deforestation_model_optimized.pth')
    
    # Get optimized size
    optimized_size = os.path.getsize('models/deforestation_model_optimized.pth')
    print(f"Optimized model size: {optimized_size / (1024*1024):.2f} MB")
    print(f"Size reduction: {((original_size - optimized_size) / original_size) * 100:.1f}%")
    
    print("✓ Model optimization complete!")

if __name__ == "__main__":
    optimize_model()
