export interface PredictionResult {
  success: boolean;
  original_image: string;
  segmentation_mask: string;
  overlay: string;
  class_percentages: Record<string, number>;
  original_size: number[];
  prediction_size: number[];
}

export interface ClassPercentage {
  class: string;
  percentage: number;
  color: string;
}

export interface ModelStatus {
  loaded: boolean;
  classes: string[];
  num_classes: number;
}

export interface ApiError {
  detail: string;
}
