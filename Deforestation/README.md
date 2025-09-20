# Deforestation Detection System

A complete AI-powered web application for land cover segmentation and deforestation detection using satellite imagery.

## 🚀 Features

- **AI-Powered Analysis**: U-Net deep learning model for pixel-level land cover classification
- **5 Land Cover Classes**: Urban, Water, Forest, Agriculture, Road
- **Modern Web Interface**: React + TypeScript frontend with Tailwind CSS
- **FastAPI Backend**: High-performance Python API with automatic documentation
- **Interactive Visualizations**: Image gallery, class distribution charts, and overlays
- **Real-time Processing**: Upload images and get instant analysis results

## 🏗️ Architecture

```
Deforestation/
├── backend/                 # FastAPI backend
│   ├── main.py             # API server
│   └── requirements.txt    # Python dependencies
├── frontend/               # React + TypeScript frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API services
│   │   └── types/          # TypeScript types
│   └── package.json        # Node dependencies
├── models/                 # Trained model files
├── data/                   # Dataset storage
└── notebooks/              # Jupyter notebooks for training
```

## 🛠️ Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd Deforestation/backend
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Place your trained model:**
   - Download the model from Google Colab
   - Place `deforestation_model.pth` in `Deforestation/models/`

5. **Start the backend server:**
   ```bash
   python main.py
   ```
   - API will be available at: http://localhost:8000
   - API docs at: http://localhost:8000/docs

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd Deforestation/frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm start
   ```
   - Frontend will be available at: http://localhost:3000

## 🎯 Usage

1. **Start both servers** (backend on port 8000, frontend on port 3000)
2. **Open your browser** and go to http://localhost:3000
3. **Upload a satellite image** using the drag-and-drop interface
4. **View the analysis results**:
   - Original image
   - Segmentation mask
   - Overlay visualization
   - Class distribution charts
   - Download results

## 📊 Model Training

The model was trained using:
- **Architecture**: U-Net with ResNet34 backbone
- **Dataset**: 60 training + 14 validation samples
- **Classes**: 5 land cover types
- **Framework**: PyTorch + segmentation-models-pytorch

Training notebook: `notebooks/deforestation_training_colab.ipynb`

## 🔧 API Endpoints

- `GET /` - Health check
- `GET /health` - Detailed health status
- `GET /model/status` - Model information
- `POST /predict` - Image prediction
- `GET /classes` - Available classes

## 🎨 Frontend Features

- **Drag & Drop Upload**: Easy image upload interface
- **Image Gallery**: Side-by-side comparison of results
- **Interactive Charts**: Bar and pie charts for class distribution
- **Responsive Design**: Works on desktop and mobile
- **Real-time Status**: Model loading and prediction status
- **Download Results**: Save all analysis outputs

## 🚀 Deployment

### Backend (FastAPI)
```bash
# Production deployment
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Frontend (React)
```bash
# Build for production
npm run build

# Serve static files
npx serve -s build -l 3000
```

## 📁 Project Structure

```
Deforestation/
├── backend/
│   ├── main.py                 # FastAPI application
│   └── requirements.txt        # Python dependencies
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/         # React components
│   │   │   ├── ImageGallery.tsx
│   │   │   ├── ClassDistribution.tsx
│   │   │   └── LoadingSpinner.tsx
│   │   ├── services/           # API services
│   │   │   └── api.ts
│   │   ├── types/              # TypeScript types
│   │   │   └── index.ts
│   │   ├── App.tsx             # Main app component
│   │   └── index.tsx           # App entry point
│   ├── package.json            # Node dependencies
│   └── tailwind.config.js      # Tailwind configuration
├── models/                     # Trained model storage
├── data/                       # Dataset storage
├── notebooks/                  # Jupyter notebooks
└── README.md                   # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- PyTorch team for the deep learning framework
- segmentation-models-pytorch for the U-Net implementation
- FastAPI for the excellent Python web framework
- React team for the frontend framework
- Tailwind CSS for the utility-first CSS framework
