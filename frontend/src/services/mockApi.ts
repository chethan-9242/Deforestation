/**
 * Mock API Service for Offline Mode
 * Simulates AI functionality without requiring a backend server
 */

import { PredictionResult } from '../types/index';

// Mock class definitions
const mockClassDict = {
  'urban': [0, 255, 255],
  'water': [0, 0, 255], 
  'forest': [0, 255, 0],
  'agriculture': [255, 255, 0],
  'road': [255, 0, 255]
};

const mockClassNames = Object.keys(mockClassDict);

// Simple but effective image analysis
function analyzeImageContent(imageData: string): Promise<Record<string, number>> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(getDefaultPercentages());
        return;
      }
      
      // Resize for faster processing
      const maxSize = 100; // Smaller for faster processing
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      let greenPixels = 0;
      let brownPixels = 0;
      let bluePixels = 0;
      let totalPixels = 0;
      
      // Sample every 2nd pixel for better accuracy
      for (let i = 0; i < data.length; i += 8) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];
        
        totalPixels++;
        
        // Detect green (forest) - very sensitive
        if (g > r && g > b && g > 60) {
          greenPixels++;
        }
        // Detect brown/red (deforested/agriculture) - very sensitive
        else if (r > g && r > b && r > 80) {
          brownPixels++;
        }
        // Detect blue (water)
        else if (b > r && b > g && b > 80) {
          bluePixels++;
        }
      }
      
      if (totalPixels === 0) {
        resolve(getDefaultPercentages());
        return;
      }
      
      const forestPercent = Math.round((greenPixels / totalPixels) * 100 * 100) / 100;
      const agriculturePercent = Math.round((brownPixels / totalPixels) * 100 * 100) / 100;
      const waterPercent = Math.round((bluePixels / totalPixels) * 100 * 100) / 100;
      
      // Calculate remaining percentages
      const remaining = Math.max(0, 100 - forestPercent - agriculturePercent - waterPercent);
      const urbanPercent = Math.round((remaining * 0.6) * 100) / 100;
      const roadPercent = Math.round((remaining * 0.4) * 100) / 100;
      
      console.log('Raw Analysis:', { greenPixels, brownPixels, bluePixels, totalPixels });
      console.log('Calculated Percentages:', { forestPercent, agriculturePercent, waterPercent });
      
      resolve({
        'forest': Math.max(0, forestPercent),
        'agriculture': Math.max(0, agriculturePercent),
        'urban': Math.max(0, urbanPercent),
        'water': Math.max(0, waterPercent),
        'road': Math.max(0, roadPercent)
      });
    };
    
    img.onerror = () => {
      console.log('Image load error, using default percentages');
      resolve(getDefaultPercentages());
    };
    
    img.src = imageData;
  });
}

// Default percentages if analysis fails
function getDefaultPercentages(): Record<string, number> {
  return {
    'forest': 50,
    'agriculture': 30,
    'urban': 10,
    'water': 5,
    'road': 5
  };
}

// Create a mock segmentation mask
function createMockMask(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  
  // Create a simple pattern-based mask
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;
  
  for (let i = 0; i < data.length; i += 4) {
    const x = (i / 4) % width;
    const y = Math.floor((i / 4) / width);
    
    // Create a pattern based on position
    const classIndex = Math.floor((x * 0.1 + y * 0.1) * mockClassNames.length) % mockClassNames.length;
    const color = Object.values(mockClassDict)[classIndex];
    
    data[i] = color[0];     // Red
    data[i + 1] = color[1]; // Green
    data[i + 2] = color[2]; // Blue
    data[i + 3] = 255;      // Alpha
  }
  
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL('image/png');
}

// Create a mock overlay
function createMockOverlay(originalImage: string, mask: string): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d')!;
      
      // Draw original image
      ctx.drawImage(img, 0, 0);
      
      // Create overlay effect
      ctx.globalAlpha = 0.6;
      ctx.globalCompositeOperation = 'multiply';
      
      // Draw a simple overlay pattern
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, 'rgba(0, 255, 0, 0.3)'); // Forest green
      gradient.addColorStop(0.5, 'rgba(255, 255, 0, 0.3)'); // Agriculture yellow
      gradient.addColorStop(1, 'rgba(0, 255, 255, 0.3)'); // Urban cyan
      
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      resolve(canvas.toDataURL('image/png'));
    };
    img.src = originalImage;
  });
}

// Detect deforestation from percentages with realistic confidence levels
function detectDeforestation(percentages: Record<string, number>): { detected: boolean; confidence: number } {
  const forestPercentage = percentages.forest || 0;
  const agriculturePercentage = percentages.agriculture || 0;
  const urbanPercentage = percentages.urban || 0;
  
  // Calculate deforestation score (0-100)
  let deforestationScore = 0;
  
  // Forest loss contributes to deforestation
  if (forestPercentage < 20) deforestationScore += 40; // Very low forest
  else if (forestPercentage < 40) deforestationScore += 30; // Low forest
  else if (forestPercentage < 60) deforestationScore += 20; // Medium forest
  else if (forestPercentage < 80) deforestationScore += 10; // Good forest
  
  // Agriculture increase contributes to deforestation
  if (agriculturePercentage > 50) deforestationScore += 30; // Very high agriculture
  else if (agriculturePercentage > 35) deforestationScore += 25; // High agriculture
  else if (agriculturePercentage > 20) deforestationScore += 15; // Medium agriculture
  else if (agriculturePercentage > 10) deforestationScore += 10; // Low agriculture
  
  // Urban development contributes to deforestation
  if (urbanPercentage > 30) deforestationScore += 20; // Very high urban
  else if (urbanPercentage > 20) deforestationScore += 15; // High urban
  else if (urbanPercentage > 10) deforestationScore += 10; // Medium urban
  else if (urbanPercentage > 5) deforestationScore += 5; // Low urban
  
  // Determine if deforestation is detected
  const detected = deforestationScore > 30; // Threshold for detection
  
  // Calculate realistic confidence based on score
  let confidence;
  if (detected) {
    // Deforestation detected - confidence based on severity
    if (deforestationScore > 70) confidence = 85 + Math.random() * 10; // 85-95%
    else if (deforestationScore > 50) confidence = 75 + Math.random() * 10; // 75-85%
    else if (deforestationScore > 40) confidence = 65 + Math.random() * 10; // 65-75%
    else confidence = 55 + Math.random() * 10; // 55-65%
  } else {
    // No deforestation - confidence based on forest health
    if (forestPercentage > 80) confidence = 85 + Math.random() * 10; // 85-95%
    else if (forestPercentage > 60) confidence = 75 + Math.random() * 10; // 75-85%
    else if (forestPercentage > 40) confidence = 65 + Math.random() * 10; // 65-75%
    else confidence = 55 + Math.random() * 10; // 55-65%
  }
  
  confidence = Math.round(confidence * 100) / 100; // Round to 2 decimal places
  
  console.log('Deforestation Analysis:', {
    forestPercentage,
    agriculturePercentage,
    urbanPercentage,
    deforestationScore,
    detected,
    confidence
  });
  
  return { detected, confidence };
}

// Mock API functions
export const mockApi = {
  async getModelStatus() {
    return {
      loaded: true,
      classes: mockClassNames,
      num_classes: mockClassNames.length
    };
  },

  async predictImage(file: File): Promise<PredictionResult> {
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Convert file to base64
    const originalImage = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
    });
    
    // Simple but effective analysis - simulate realistic deforestation detection
    const percentages = await analyzeImageContent(originalImage);
    const mask = createMockMask(256, 256);
    const overlay = await createMockOverlay(originalImage, mask);
    
    // Force realistic deforestation detection based on image analysis
    const deforestationResult = detectDeforestation(percentages);
    
    // Log the analysis for debugging
    console.log('Image Analysis:', percentages);
    console.log('Deforestation Result:', deforestationResult);
    
    return {
      success: true,
      original_image: originalImage,
      segmentation_mask: mask,
      overlay: overlay,
      class_percentages: percentages,
      original_size: [800, 600], // Mock size
      prediction_size: [256, 256]
    };
  },

  async getClasses() {
    return {
      classes: mockClassNames,
      class_dict: mockClassDict,
      num_classes: mockClassNames.length
    };
  }
};

// Check if we're in offline mode
export const isOfflineMode = () => {
  // Always use mock API for offline app
  return localStorage.getItem('use-mock-api') === 'true' ||
         localStorage.getItem('offline-mode') === 'true' ||
         !window.navigator.onLine ||
         window.location.hostname === 'localhost' ||
         window.location.port === '51122' ||
         window.location.port === '3000';
};

// Auto-detect offline mode and use mock API
export const getApiService = () => {
  if (isOfflineMode()) {
    console.log('🌐 Running in offline mode with mock AI');
    return mockApi;
  }
  
  // Import real API service
  return require('./api').default;
};
