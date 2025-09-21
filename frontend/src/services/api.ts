import axios from 'axios';
import { PredictionResult, ModelStatus } from '../types';
import { mockApi, isOfflineMode } from './mockApi';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 seconds timeout for predictions
});

// Check if we should use mock API
const useMockApi = () => {
  return isOfflineMode() || 
         localStorage.getItem('use-mock-api') === 'true' ||
         process.env.REACT_APP_USE_MOCK_API === 'true';
};

export const predictImage = async (file: File): Promise<PredictionResult> => {
  // Use mock API if offline or forced
  if (useMockApi()) {
    console.log('🌐 Using mock API for prediction');
    return mockApi.predictImage(file);
  }

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
    console.log('⚠️ Backend API failed, falling back to mock API');
    return mockApi.predictImage(file);
  }
};

export const getModelStatus = async (): Promise<ModelStatus> => {
  // Use mock API if offline or forced
  if (useMockApi()) {
    return mockApi.getModelStatus();
  }

  try {
    const response = await api.get('/model/status');
    return response.data;
  } catch (error) {
    console.log('⚠️ Backend API failed, falling back to mock API');
    return mockApi.getModelStatus();
  }
};

export const getClasses = async () => {
  // Use mock API if offline or forced
  if (useMockApi()) {
    return mockApi.getClasses();
  }

  try {
    const response = await api.get('/classes');
    return response.data;
  } catch (error) {
    console.log('⚠️ Backend API failed, falling back to mock API');
    return mockApi.getClasses();
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
