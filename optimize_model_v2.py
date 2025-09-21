import torch
import os

def optimize_model():
    print("Loading original model...")
    model = torch.load('models/deforestation_model.pth', map_location='cpu')
    
    original_size = os.path.getsize('models/deforestation_model.pth')
    print(f"Original model size: {original_size / (1024*1024):.2f} MB")
    
    # Try different optimization techniques
    print("Optimizing model...")
    
    # Method 1: Remove optimizer state if present
    if 'optimizer' in model:
        del model['optimizer']
        print("✓ Removed optimizer state")
    
    # Method 2: Keep only model state dict
    if 'model_state_dict' in model:
        model = model['model_state_dict']
        print("✓ Extracted model state dict")
    
    # Method 3: Compress by removing unnecessary keys
    if isinstance(model, dict):
        keys_to_remove = [k for k in model.keys() if 'optimizer' in k.lower() or 'scheduler' in k.lower()]
        for key in keys_to_remove:
            del model[key]
        print(f"✓ Removed {len(keys_to_remove)} unnecessary keys")
    
    # Save optimized model
    print("Saving optimized model...")
    torch.save(model, 'models/deforestation_model_optimized.pth')
    
    optimized_size = os.path.getsize('models/deforestation_model_optimized.pth')
    print(f"Optimized model size: {optimized_size / (1024*1024):.2f} MB")
    print(f"Size reduction: {((original_size - optimized_size) / original_size) * 100:.1f}%")
    
    print("✓ Model optimization complete!")

if __name__ == "__main__":
    optimize_model()
