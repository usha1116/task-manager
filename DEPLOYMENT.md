# 🚀 Deployment Guide - TaskFlow MERN Stack

This guide will walk you through deploying your MERN Stack Task Manager to GitHub and Vercel.

## 📋 Prerequisites

- GitHub account
- Vercel account (free tier available)
- MongoDB Atlas account (for cloud database)
- Node.js installed locally

## 🔄 Step 1: Push to GitHub

### 1.1 Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `taskflow-mern`)
5. Make it **Public** (for free Vercel deployment)
6. **Don't** initialize with README, .gitignore, or license (we already have these)
7. Click "Create repository"

### 1.2 Push Your Code to GitHub

```bash
# Add the remote repository (replace with your GitHub username and repo name)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Step 2: Backend Deployment (Render/Railway/Heroku)

### Option A: Deploy to Render (Recommended - Free)

1. **Sign up at [Render](https://render.com)**
2. **Connect your GitHub repository**
3. **Create a new Web Service**
   - Select your repository
   - Name: `taskflow-backend`
   - Root Directory: `server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: Free

4. **Add Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_atlas_connection_string
   JWT_SECRET=your_super_secret_jwt_key
   ```

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment to complete
   - Copy the generated URL (e.g., `https://taskflow-backend.onrender.com`)

### Option B: Deploy to Railway

1. **Sign up at [Railway](https://railway.app)**
2. **Connect your GitHub repository**
3. **Create a new service**
   - Select your repository
   - Set root directory to `server`
   - Add environment variables as above

### Option C: Deploy to Heroku

1. **Sign up at [Heroku](https://heroku.com)**
2. **Install Heroku CLI**
3. **Deploy using CLI**
   ```bash
   heroku create taskflow-backend
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
   heroku config:set JWT_SECRET=your_super_secret_jwt_key
   git push heroku main
   ```

## 🎨 Step 3: Frontend Deployment (Vercel)

### 3.1 Deploy to Vercel

1. **Sign up at [Vercel](https://vercel.com)**
2. **Import your GitHub repository**
3. **Configure the project**
   - Framework Preset: `Create React App`
   - Root Directory: `client`
   - Build Command: `npm run build`
   - Output Directory: `build`
   - Install Command: `npm install`

4. **Add Environment Variables**
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

5. **Deploy**
   - Click "Deploy"
   - Wait for deployment to complete
   - Your app will be available at `https://your-app-name.vercel.app`

### 3.2 Alternative: Deploy using Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to client directory
cd client

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy: Yes
# - Which scope: Select your account
# - Link to existing project: No
# - Project name: taskflow-frontend
# - Directory: ./
# - Override settings: No
```

## 🗄️ Step 4: Database Setup (MongoDB Atlas)

### 4.1 Create MongoDB Atlas Cluster

1. **Sign up at [MongoDB Atlas](https://www.mongodb.com/atlas)**
2. **Create a new cluster**
   - Choose the free tier (M0)
   - Select your preferred cloud provider and region
   - Click "Create"

3. **Set up database access**
   - Go to "Database Access"
   - Click "Add New Database User"
   - Username: `taskflow-user`
   - Password: Generate a secure password
   - Role: "Read and write to any database"
   - Click "Add User"

4. **Set up network access**
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get connection string**
   - Go to "Clusters"
   - Click "Connect"
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `taskflow`

### 4.2 Update Environment Variables

Update your backend environment variables with the MongoDB Atlas connection string:

```
MONGODB_URI=mongodb+srv://taskflow-user:your_password@cluster0.xxxxx.mongodb.net/taskflow?retryWrites=true&w=majority
```

## 🔧 Step 5: Update Frontend API URL

### 5.1 Update Vercel Environment Variables

1. Go to your Vercel project dashboard
2. Navigate to "Settings" → "Environment Variables"
3. Add/Update:
   ```
   REACT_APP_API_URL=https://your-backend-url.com/api
   ```

### 5.2 Redeploy Frontend

1. Go to your Vercel project dashboard
2. Click "Deployments"
3. Click "Redeploy" on the latest deployment

## ✅ Step 6: Test Your Deployment

### 6.1 Test Backend API

```bash
# Test health endpoint
curl https://your-backend-url.com/api/health

# Test registration
curl -X POST https://your-backend-url.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

### 6.2 Test Frontend

1. Visit your Vercel URL
2. Try to register a new user
3. Test login functionality
4. Create and manage tasks
5. Test dark mode toggle

## 🔒 Step 7: Security Considerations

### 7.1 Environment Variables

- ✅ Never commit `.env` files to Git
- ✅ Use strong, unique JWT secrets
- ✅ Use environment-specific database URLs
- ✅ Regularly rotate secrets

### 7.2 CORS Configuration

Update your backend CORS settings for production:

```javascript
// In server/server.js
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend-domain.vercel.app']
    : ['http://localhost:3000'],
  credentials: true
}));
```

### 7.3 Rate Limiting

Ensure rate limiting is enabled for production:

```javascript
// In server/server.js
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## 🚨 Troubleshooting

### Common Issues

1. **CORS Errors**
   - Check CORS configuration in backend
   - Ensure frontend URL is in allowed origins

2. **Database Connection Issues**
   - Verify MongoDB Atlas connection string
   - Check network access settings
   - Ensure database user has correct permissions

3. **Environment Variables Not Working**
   - Verify variable names (case-sensitive)
   - Check if variables are set in deployment platform
   - Redeploy after adding variables

4. **Build Failures**
   - Check build logs in Vercel
   - Ensure all dependencies are in package.json
   - Verify Node.js version compatibility

### Debug Commands

```bash
# Check backend logs
# Render: Go to your service dashboard → Logs
# Railway: Go to your service dashboard → Logs
# Heroku: heroku logs --tail

# Check frontend build
cd client
npm run build

# Test API locally
curl http://localhost:5000/api/health
```

## 📊 Monitoring and Analytics

### 7.1 Backend Monitoring

- **Render**: Built-in monitoring dashboard
- **Railway**: Built-in logs and metrics
- **Heroku**: Heroku Metrics and Logs

### 7.2 Frontend Analytics

Consider adding analytics to your React app:

```bash
# Install Google Analytics
npm install react-ga

# Or use Vercel Analytics (built-in)
```

## 🔄 Continuous Deployment

### 7.1 Automatic Deployments

Both Vercel and your backend platform will automatically deploy when you push to GitHub:

```bash
# Make changes locally
git add .
git commit -m "Update feature"
git push origin main

# Automatic deployment will trigger
```

### 7.2 Environment-Specific Deployments

Consider setting up different environments:

- **Development**: `localhost:3000` + `localhost:5000`
- **Staging**: `staging.yourapp.com` + `staging-api.yourapp.com`
- **Production**: `yourapp.com` + `api.yourapp.com`

## 🎉 Congratulations!

Your MERN Stack Task Manager is now deployed and accessible worldwide! 

### Your URLs:
- **Frontend**: `https://your-app-name.vercel.app`
- **Backend API**: `https://your-backend-url.com`
- **GitHub Repository**: `https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

### Next Steps:
1. Share your deployed app with others
2. Monitor performance and usage
3. Add custom domain (optional)
4. Set up monitoring and alerts
5. Consider adding more features

---

**Happy Deploying! 🚀**
