#!/usr/bin/env python3
"""
Deforestation Detection Model Training Script
Run this script to train a U-Net model for land cover segmentation
"""

import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
import numpy as np
import pandas as pd
from PIL import Image
import matplotlib.pyplot as plt
from pathlib import Path
import os
from tqdm import tqdm
import albumentations as A
from albumentations.pytorch import ToTensorV2
import segmentation_models_pytorch as smp
import argparse
import json

def main():
    # Parse command line arguments
    parser = argparse.ArgumentParser(description='Train deforestation detection model')
    parser.add_argument('--data_dir', type=str, default='data/bhuvan', 
                       help='Path to dataset directory')
    parser.add_argument('--epochs', type=int, default=50, 
                       help='Number of training epochs')
    parser.add_argument('--batch_size', type=int, default=8, 
                       help='Batch size for training')
    parser.add_argument('--lr', type=float, default=0.001, 
                       help='Learning rate')
    parser.add_argument('--output_dir', type=str, default='outputs', 
                       help='Output directory for model and results')
    
    args = parser.parse_args()
    
    # Create output directory
    os.makedirs(args.output_dir, exist_ok=True)
    
    # Set device
    device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
    print(f"Using device: {device}")
    
    # Set random seeds
    torch.manual_seed(42)
    np.random.seed(42)
    
    # Class configuration
    class_dict = {
        'urban': (0, 255, 255),
        'water': (0, 0, 255), 
        'forest': (0, 255, 0),
        'agriculture': (255, 255, 0),
        'road': (255, 0, 255)
    }
    num_classes = len(class_dict)
    
    # Dataset paths
    train_image_dir = Path(args.data_dir) / 'train_image'
    train_mask_dir = Path(args.data_dir) / 'train_mask'
    val_image_dir = Path(args.data_dir) / 'val_image'
    val_mask_dir = Path(args.data_dir) / 'val_mask'
    
    # Data transforms
    train_transform = A.Compose([
        A.Resize(256, 256),
        A.HorizontalFlip(p=0.5),
        A.VerticalFlip(p=0.5),
        A.RandomRotate90(p=0.5),
        A.RandomBrightnessContrast(p=0.2),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2(),
    ])
    
    val_transform = A.Compose([
        A.Resize(256, 256),
        A.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ToTensorV2(),
    ])
    
    # Create datasets
    train_dataset = LandCoverDataset(train_image_dir, train_mask_dir, transform=train_transform)
    val_dataset = LandCoverDataset(val_image_dir, val_mask_dir, transform=val_transform)
    
    # Create data loaders
    train_loader = DataLoader(train_dataset, batch_size=args.batch_size, shuffle=True, num_workers=2)
    val_loader = DataLoader(val_dataset, batch_size=args.batch_size, shuffle=False, num_workers=2)
    
    print(f"Training samples: {len(train_dataset)}")
    print(f"Validation samples: {len(val_dataset)}")
    
    # Create model
    model = smp.Unet(
        encoder_name="resnet34",
        encoder_weights="imagenet",
        in_channels=3,
        classes=num_classes,
        activation=None,
    )
    model = model.to(device)
    
    # Loss and optimizer
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=args.lr)
    scheduler = optim.lr_scheduler.ReduceLROnPlateau(optimizer, mode='min', patience=5, factor=0.5)
    
    # Training loop
    best_val_loss = float('inf')
    train_losses, val_losses = [], []
    train_accs, val_accs = [], []
    
    print(f"Starting training for {args.epochs} epochs...")
    
    for epoch in range(args.epochs):
        print(f"\nEpoch {epoch+1}/{args.epochs}")
        print("-" * 50)
        
        # Training
        train_loss, train_acc = train_epoch(model, train_loader, criterion, optimizer, device)
        
        # Validation
        val_loss, val_acc = validate_epoch(model, val_loader, criterion, device)
        
        # Learning rate scheduling
        scheduler.step(val_loss)
        
        # Store metrics
        train_losses.append(train_loss)
        val_losses.append(val_loss)
        train_accs.append(train_acc)
        val_accs.append(val_acc)
        
        # Print metrics
        print(f"Train Loss: {train_loss:.4f}, Train Acc: {train_acc:.4f}")
        print(f"Val Loss: {val_loss:.4f}, Val Acc: {val_acc:.4f}")
        print(f"Learning Rate: {optimizer.param_groups[0]['lr']:.6f}")
        
        # Save best model
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save({
                'model_state_dict': model.state_dict(),
                'class_dict': class_dict,
                'num_classes': num_classes,
                'model_config': {
                    'encoder_name': 'resnet34',
                    'encoder_weights': 'imagenet',
                    'in_channels': 3,
                    'classes': num_classes
                }
            }, os.path.join(args.output_dir, 'best_model.pth'))
            print("New best model saved!")
        
        # Early stopping
        if epoch > 10 and val_loss > best_val_loss * 1.1:
            print("Early stopping triggered!")
            break
    
    # Save training curves
    training_data = {
        'train_losses': train_losses,
        'val_losses': val_losses,
        'train_accs': train_accs,
        'val_accs': val_accs,
        'best_val_loss': best_val_loss
    }
    
    with open(os.path.join(args.output_dir, 'training_curves.json'), 'w') as f:
        json.dump(training_data, f)
    
    # Plot and save training curves
    plot_training_curves(train_losses, val_losses, train_accs, val_accs, args.output_dir)
    
    print(f"\nTraining completed! Results saved to {args.output_dir}/")
    print(f"Best validation loss: {best_val_loss:.4f}")
    print(f"Final validation accuracy: {val_accs[-1]:.4f}")

# Dataset class (same as in notebook)
class LandCoverDataset(Dataset):
    def __init__(self, image_dir, mask_dir, transform=None, num_classes=5):
        self.image_dir = Path(image_dir)
        self.mask_dir = Path(mask_dir)
        self.transform = transform
        self.num_classes = num_classes
        
        # Get all image files
        self.image_files = list(self.image_dir.glob('*.jpg'))
        self.mask_files = list(self.mask_dir.glob('*.png'))
        
        # Filter for matching pairs
        self.valid_pairs = []
        for img_file in self.image_files:
            mask_file = self.mask_dir / f"{img_file.stem}.png"
            if mask_file.exists():
                self.valid_pairs.append((img_file, mask_file))
        
        print(f"Found {len(self.valid_pairs)} valid image-mask pairs")
    
    def __len__(self):
        return len(self.valid_pairs)
    
    def __getitem__(self, idx):
        img_path, mask_path = self.valid_pairs[idx]
        
        # Load image and mask
        image = np.array(Image.open(img_path).convert('RGB'))
        mask = np.array(Image.open(mask_path).convert('RGB'))
        
        # Convert mask to class indices
        mask_indices = self.rgb_to_class_indices(mask)
        
        if self.transform:
            augmented = self.transform(image=image, mask=mask_indices)
            image = augmented['image']
            mask_indices = augmented['mask']
        
        return image, mask_indices.long()
    
    def rgb_to_class_indices(self, mask_rgb):
        """Convert RGB mask to class indices"""
        class_dict = {
            'urban': (0, 255, 255),
            'water': (0, 0, 255), 
            'forest': (0, 255, 0),
            'agriculture': (255, 255, 0),
            'road': (255, 0, 255)
        }
        
        mask_indices = np.zeros((mask_rgb.shape[0], mask_rgb.shape[1]), dtype=np.uint8)
        
        for i, (class_name, rgb_color) in enumerate(class_dict.items()):
            # Find pixels matching this class color
            class_mask = np.all(mask_rgb == rgb_color, axis=2)
            mask_indices[class_mask] = i
        
        return mask_indices

# Training and validation functions (same as in notebook)
def train_epoch(model, train_loader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    correct_pixels = 0
    total_pixels = 0
    
    for images, masks in tqdm(train_loader, desc="Training"):
        images, masks = images.to(device), masks.to(device)
        
        optimizer.zero_grad()
        outputs = model(images)
        loss = criterion(outputs, masks)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        
        # Calculate pixel accuracy
        _, predicted = torch.max(outputs, 1)
        correct_pixels += (predicted == masks).sum().item()
        total_pixels += masks.numel()
    
    epoch_loss = running_loss / len(train_loader)
    epoch_acc = correct_pixels / total_pixels
    
    return epoch_loss, epoch_acc

def validate_epoch(model, val_loader, criterion, device):
    model.eval()
    running_loss = 0.0
    correct_pixels = 0
    total_pixels = 0
    
    with torch.no_grad():
        for images, masks in tqdm(val_loader, desc="Validation"):
            images, masks = images.to(device), masks.to(device)
            
            outputs = model(images)
            loss = criterion(outputs, masks)
            
            running_loss += loss.item()
            
            # Calculate pixel accuracy
            _, predicted = torch.max(outputs, 1)
            correct_pixels += (predicted == masks).sum().item()
            total_pixels += masks.numel()
    
    epoch_loss = running_loss / len(val_loader)
    epoch_acc = correct_pixels / total_pixels
    
    return epoch_loss, epoch_acc

def plot_training_curves(train_losses, val_losses, train_accs, val_accs, output_dir):
    """Plot and save training curves"""
    plt.figure(figsize=(15, 5))
    
    plt.subplot(1, 2, 1)
    plt.plot(train_losses, label='Train Loss')
    plt.plot(val_losses, label='Val Loss')
    plt.title('Training and Validation Loss')
    plt.xlabel('Epoch')
    plt.ylabel('Loss')
    plt.legend()
    plt.grid(True)
    
    plt.subplot(1, 2, 2)
    plt.plot(train_accs, label='Train Accuracy')
    plt.plot(val_accs, label='Val Accuracy')
    plt.title('Training and Validation Accuracy')
    plt.xlabel('Epoch')
    plt.ylabel('Accuracy')
    plt.legend()
    plt.grid(True)
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'training_curves.png'), dpi=300, bbox_inches='tight')
    plt.show()

if __name__ == "__main__":
    main()
