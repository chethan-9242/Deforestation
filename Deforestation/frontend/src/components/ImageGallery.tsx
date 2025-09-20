import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ImageGalleryProps {
  originalImage: string;
  segmentationMask: string;
  overlay: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({
  originalImage,
  segmentationMask,
  overlay,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const images = [
    {
      src: originalImage,
      title: 'Original Image',
      description: 'Uploaded satellite image'
    },
    {
      src: segmentationMask,
      title: 'Segmentation Mask',
      description: 'AI-detected land cover classes'
    },
    {
      src: overlay,
      title: 'Overlay',
      description: 'Original image with segmentation overlay'
    }
  ];

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6 border-b">
        <h3 className="text-xl font-semibold text-gray-900">Image Analysis</h3>
        <p className="text-gray-600 mt-1">
          {images[currentIndex].description}
        </p>
      </div>

      <div className="relative">
        {/* Main Image Display */}
        <div className="relative aspect-video bg-gray-100">
          <img
            src={images[currentIndex].src}
            alt={images[currentIndex].title}
            className="w-full h-full object-contain"
          />
          
          {/* Navigation Arrows */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Fullscreen Button */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
          >
            <Maximize2 className="w-5 h-5" />
          </button>
        </div>

        {/* Thumbnail Navigation */}
        <div className="p-4 bg-gray-50">
          <div className="flex space-x-2 justify-center">
            {images.map((image, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                  index === currentIndex
                    ? 'border-blue-500 ring-2 ring-blue-200'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={image.src}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-20"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Image Info */}
      <div className="p-4 bg-gray-50 border-t">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">{images[currentIndex].title}</h4>
            <p className="text-sm text-gray-600">{images[currentIndex].description}</p>
          </div>
          <div className="text-sm text-gray-500">
            {currentIndex + 1} of {images.length}
          </div>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <div className="relative max-w-7xl max-h-full">
            <img
              src={images[currentIndex].src}
              alt={images[currentIndex].title}
              className="max-w-full max-h-full object-contain"
            />
            
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 transition-all"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
