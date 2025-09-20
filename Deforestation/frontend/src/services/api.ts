import axios from 'axios';
import { PredictionResult, ModelStatus } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for predictions
});

export const predictImage = async (file: File): Promise<PredictionResult> => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post('/predict', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Prediction failed: ${message}`);
    }
    throw new Error('Prediction failed: Unknown error');
  }
};

export const getModelStatus = async (): Promise<ModelStatus> => {
  try {
    const response = await api.get('/model/status');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to get model status: ${message}`);
    }
    throw new Error('Failed to get model status: Unknown error');
  }
};

export const getClasses = async () => {
  try {
    const response = await api.get('/classes');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Failed to get classes: ${message}`);
    }
    throw new Error('Failed to get classes: Unknown error');
  }
};

export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const message = error.response?.data?.detail || error.message;
      throw new Error(`Health check failed: ${message}`);
    }
    throw new Error('Health check failed: Unknown error');
  }
};
