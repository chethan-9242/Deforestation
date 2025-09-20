# 🚀 Netlify Deployment Guide

## Overview
This guide will help you deploy the Deforestation Detection System to production using:
- **Frontend**: Netlify (React app)
- **Backend**: Railway/Render (FastAPI app)

## Prerequisites
- GitHub account
- Netlify account
- Railway/Render account
- Git installed locally

---

## Step 1: Prepare Your Repository

### 1.1 Push to GitHub
```bash
# Initialize git if not already done
cd Deforestation
git init
git add .
git commit -m "Initial commit"

# Create GitHub repository and push
git remote add origin https://github.com/yourusername/deforestation-detection.git
git branch -M main
git push -u origin main
```

---

## Step 2: Deploy Backend to Railway

### 2.1 Create Railway Account
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Connect your GitHub account

### 2.2 Deploy Backend
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose your repository
4. Select the `backend` folder
5. Railway will automatically detect Python and install dependencies

### 2.3 Configure Environment Variables
In Railway dashboard, add these environment variables:
```
PORT=8000
PYTHON_VERSION=3.11.0
```

### 2.4 Upload Model File
1. Go to your Railway project dashboard
2. Click on "Files" tab
3. Navigate to `models/` directory
4. Upload your `deforestation_model.pth` file

### 2.5 Get Backend URL
1. Once deployed, Railway will give you a URL like: `https://your-app-name.railway.app`
2. Copy this URL - you'll need it for the frontend

---

## Step 3: Deploy Frontend to Netlify

### 3.1 Create Netlify Account
1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Connect your GitHub account

### 3.2 Deploy Frontend
1. Click "New site from Git"
2. Choose GitHub
3. Select your repository
4. Configure build settings:
   - **Base directory**: `frontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `frontend/build`

### 3.3 Configure Environment Variables
In Netlify dashboard:
1. Go to Site settings → Environment variables
2. Add: `REACT_APP_API_URL` = `https://your-backend-url.railway.app`

### 3.4 Update CORS Settings
1. Go to your Railway backend dashboard
2. Update the CORS origins in `main.py`:
```python
allow_origins=[
    "http://localhost:3000", 
    "http://127.0.0.1:3000",
    "https://your-netlify-app.netlify.app",  # Your actual Netlify URL
    "https://*.netlify.app"
],
```

---

## Step 4: Final Configuration

### 4.1 Update API URL
1. Get your Netlify URL (e.g., `https://amazing-app-123.netlify.app`)
2. Update `frontend/src/services/api.ts`:
```typescript
const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://your-backend-url.railway.app';
```

### 4.2 Update CORS in Backend
1. Update the CORS origins in your Railway backend
2. Redeploy the backend

### 4.3 Test the Application
1. Visit your Netlify URL
2. Test image upload and prediction
3. Check browser console for any errors

---

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain in Netlify
1. Go to Site settings → Domain management
2. Add your custom domain
3. Configure DNS settings as instructed

---

## Troubleshooting

### Common Issues:

1. **CORS Errors**
   - Ensure backend CORS includes your Netlify URL
   - Check that environment variables are set correctly

2. **Model Not Found**
   - Verify model file is uploaded to Railway
   - Check file path in backend code

3. **Build Failures**
   - Check Node.js version (should be 18+)
   - Verify all dependencies are in package.json

4. **API Connection Issues**
   - Verify REACT_APP_API_URL environment variable
   - Check backend is running and accessible

### Debug Steps:
1. Check Netlify build logs
2. Check Railway deployment logs
3. Test API endpoints directly
4. Check browser network tab for errors

---

## Production Optimizations

### Frontend:
- Enable gzip compression in Netlify
- Set up CDN for static assets
- Configure caching headers

### Backend:
- Set up monitoring and logging
- Configure auto-scaling
- Set up database for user data (if needed)

---

## Cost Estimation

### Netlify:
- **Free tier**: 100GB bandwidth, 300 build minutes
- **Pro**: $19/month for more bandwidth and features

### Railway:
- **Free tier**: $5 credit monthly
- **Pro**: Pay-as-you-go based on usage

---

## Security Considerations

1. **Environment Variables**: Never commit API keys to git
2. **CORS**: Only allow necessary origins
3. **File Upload**: Implement file size and type validation
4. **Rate Limiting**: Consider implementing rate limiting for API

---

## Monitoring

1. **Netlify Analytics**: Monitor frontend performance
2. **Railway Metrics**: Monitor backend performance
3. **Error Tracking**: Consider adding Sentry for error monitoring

---

## Support

If you encounter issues:
1. Check the logs in both Netlify and Railway
2. Verify all environment variables are set
3. Test API endpoints independently
4. Check browser console for frontend errors

---

## Next Steps

After successful deployment:
1. Set up monitoring and alerts
2. Configure custom domain
3. Implement user authentication (if needed)
4. Add more features and optimizations
5. Set up CI/CD for automatic deployments

---

*Happy Deploying! 🌲🤖*
