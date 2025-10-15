# 🚀 Setup Guide

Complete step-by-step guide to set up and run the AI-BOM-Converter project on your local machine.

---

## Table of Contents

- [Prerequisites](#prerequisites)
- [System Requirements](#system-requirements)
- [Installation Steps](#installation-steps)
- [Configuration](#configuration)
- [Running the Application](#running-the-application)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)
- [Deployment](#deployment)

---

##  Prerequisites

Before you begin, ensure you have the following installed on your machine:

### Required Software

| Software | Version | Download Link |
|----------|---------|---------------|
| **Node.js** | v18.x or higher | https://nodejs.org/ |
| **npm** | v9.x or higher | Included with Node.js |
| **Python** | v3.9 or higher | https://www.python.org/ |
| **pip** | Latest | Included with Python |
| **MongoDB** | v6.x or higher | https://www.mongodb.com/ |
| **Git** | Latest | https://git-scm.com/ |

### Optional but Recommended

- **MongoDB Compass** - GUI for MongoDB
- **Postman** - API testing tool
- **VS Code** - Code editor with extensions (ESLint, Prettier, Python)

### API Keys Required

- **OpenAI API Key** (or alternative LLM provider)
  - Sign up at https://platform.openai.com/
  - Generate API key from dashboard

---

## System Requirements

### Minimum Requirements
- **OS**: Windows 10/11, macOS 11+, or Linux (Ubuntu 20.04+)
- **RAM**: 8 GB
- **Storage**: 2 GB free space
- **Internet**: Stable connection for API calls

### Recommended Requirements
- **RAM**: 16 GB
- **Storage**: 5 GB free space
- **GPU**: For TensorFlow acceleration (optional)

---

##  Installation Steps

### Step 1: Clone the Repository

```bash
# Clone the repository
git clone https://github.com/sarthak-team/ai-bom-converter.git

# Navigate to project directory
cd ai-bom-converter
```

### Step 2: Setup Backend

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cp ../.env.example .env

# Go back to root
cd ..
```

**Expected Output:**
```
✓ Dependencies installed successfully
✓ Found 0 vulnerabilities
```

### Step 3: Setup Frontend

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Go back to root
cd ..
```

**Expected Output:**
```
✓ React app dependencies installed
✓ Ready to start development server
```

### Step 4: Setup AI Engine

```bash
# Navigate to ai-engine directory
cd ai-engine

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Go back to root
cd ..
```

**Expected Output:**
```
✓ Successfully installed Flask-3.0.0
✓ Successfully installed tensorflow-2.15.0
✓ Successfully installed langchain-0.1.0
... (all packages)
```

### Step 5: Setup MongoDB

#### Option A: Local MongoDB

```bash
# Start MongoDB service

# On macOS:
brew services start mongodb-community

# On Windows (as admin):
net start MongoDB

# On Linux:
sudo systemctl start mongod
```

Verify MongoDB is running:
```bash
# Connect to MongoDB shell
mongosh

# You should see MongoDB connection successful
```

#### Option B: MongoDB Atlas (Cloud)

1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free account
3. Create a new cluster (Free tier)
4. Wait for cluster creation (2-5 minutes)
5. Click "Connect" → "Connect your application"
6. Copy the connection string
7. Update `.env` file with your connection string

---

##  Configuration

### Step 1: Configure Environment Variables

Edit the `.env` file in the root directory:

```env
# Backend Configuration
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/bom-converter
# Or for Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.xxxxx.mongodb.net/bom-converter

# JWT Secret (generate a strong random string)
JWT_SECRET=your_super_secret_jwt_key_min_32_characters_long

# AI Engine URL
AI_ENGINE_URL=http://localhost:8000

# OpenAI API Key
OPENAI_API_KEY=sk-your-openai-api-key-here

# Frontend API URL
REACT_APP_API_URL=http://localhost:5000/api
```

### Step 2: Generate JWT Secret (Optional)

```bash
# Generate a secure random string for JWT_SECRET
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Copy the output and use it as your `JWT_SECRET`.

### Step 3: Verify Configuration

Create a simple test to verify environment variables:

```bash
# In backend directory
cd backend
node -e "require('dotenv').config(); console.log('MongoDB URI:', process.env.MONGODB_URI)"
```

**Expected Output:**
```
MongoDB URI: mongodb://localhost:27017/bom-converter
```

---

##  Running the Application

You'll need **4 terminal windows** to run all services.

### Terminal 1: MongoDB (if running locally)

```bash
# Start MongoDB
mongod

# Or if using MongoDB service:
# Already running from installation step
```

**Expected Output:**
```
{"t":{"$date":"..."},"s":"I", "c":"NETWORK", "msg":"Waiting for connections"}
```

### Terminal 2: AI Engine (Python)

```bash
# Navigate to ai-engine
cd ai-engine

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Start Flask server
python main.py
```

**Expected Output:**
```
 * Running on http://127.0.0.1:8000
 * Restarting with stat
 * Debugger is active!
```

### Terminal 3: Backend (Node.js)

```bash
# Navigate to backend
cd backend

# Start development server
npm run dev
```

**Expected Output:**
```
[nodemon] starting `node server.js`
✓ Connected to MongoDB
✓ Server is running on port 5000
✓ AI Engine connected at http://localhost:8000
```

### Terminal 4: Frontend (React)

```bash
# Navigate to frontend
cd frontend

# Start React development server
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view ai-bom-converter-frontend in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.1.x:3000
```

Your browser should automatically open to `http://localhost:3000`

---

## ✓ Verification

### Step 1: Check Backend Health

Open your browser or use curl:

```bash
curl http://localhost:5000/api/health
```

**Expected Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-14T10:30:00.000Z",
  "services": {
    "database": "connected",
    "aiEngine": "connected"
  }
}
```

### Step 2: Check AI Engine Health

```bash
curl http://localhost:8000/health
```

**Expected Response:**
```json
{
  "status": "healthy",
  "service": "AI-BOM-Converter Engine",
  "version": "1.0.0"
}
```

### Step 3: Test Frontend Access

1. Open browser to `http://localhost:3000`
2. You should see the landing page
3. Check browser console for any errors (F12)

### Step 4: Test Complete Flow (Optional)

1. Navigate to Upload page
2. Upload a sample eBOM CSV file
3. Check if conversion starts
4. Verify mBOM output is displayed

---

##  Troubleshooting

### Common Issues and Solutions

#### Issue 1: MongoDB Connection Failed

**Error:**
```
MongooseServerSelectionError: connect ECONNREFUSED 127.0.0.1:27017
```

**Solution:**
```bash
# Check if MongoDB is running
mongosh

# If not running, start it:
# macOS:
brew services start mongodb-community
# Windows (as admin):
net start MongoDB
# Linux:
sudo systemctl start mongod
```

#### Issue 2: Port Already in Use

**Error:**
```
Error: listen EADDRINUSE: address already in use :::5000
```

**Solution:**
```bash
# Find and kill the process using the port
# Windows:
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# macOS/Linux:
lsof -ti:5000 | xargs kill -9

# Or change the port in .env file
PORT=5001
```

#### Issue 3: Python Module Not Found

**Error:**
```
ModuleNotFoundError: No module named 'flask'
```

**Solution:**
```bash
# Make sure virtual environment is activated
source venv/bin/activate  # macOS/Linux
venv\Scripts\activate  # Windows

# Reinstall requirements
pip install -r requirements.txt
```

#### Issue 4: OpenAI API Key Invalid

**Error:**
```
Incorrect API key provided
```

**Solution:**
1. Verify your API key at https://platform.openai.com/api-keys
2. Make sure there are no extra spaces in `.env` file
3. Restart the AI engine after updating

#### Issue 5: npm Dependencies Issues

**Error:**
```
npm ERR! code ERESOLVE
```

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# Or use legacy peer deps
npm install --legacy-peer-deps
```

#### Issue 6: TensorFlow Installation Issues

**Error:**
```
ERROR: Could not find a version that satisfies the requirement tensorflow
```

**Solution:**
```bash
# For CPU-only version (lighter):
pip install tensorflow-cpu

# For specific Python version compatibility:
pip install tensorflow==2.15.0 --upgrade

# On Apple Silicon (M1/M2):
pip install tensorflow-macos
pip install tensorflow-metal
```

#### Issue 7: CORS Errors in Browser

**Error:**
```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solution:**
1. Verify `CORS_ORIGIN` in backend `.env` matches frontend URL
2. Restart backend server after changing `.env`
3. Clear browser cache

#### Issue 8: File Upload Fails

**Error:**
```
File size exceeds limit
```

**Solution:**
1. Check `MAX_FILE_SIZE` in `.env` (default: 10MB)
2. Increase if needed: `MAX_FILE_SIZE=52428800` (50MB)
3. Restart backend

---

## 🚢 Deployment

### Prerequisites for Deployment

- MongoDB Atlas account (free tier available)
- Vercel account (for frontend)
- Render/Railway account (for backend & AI engine)
- Domain name (optional)

### Step 1: Deploy MongoDB

1. Create MongoDB Atlas cluster
2. Whitelist IP addresses (0.0.0.0/0 for all IPs or specific deployment IPs)
3. Create database user with password
4. Copy connection string

### Step 2: Deploy AI Engine

#### Using Railway

```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Navigate to ai-engine
cd ai-engine

# Initialize project
railway init

# Deploy
railway up
```

#### Using Docker + Any Cloud

```bash
# Build Docker image
docker build -t ai-bom-engine ./ai-engine

# Push to Docker Hub
docker tag ai-bom-engine your-username/ai-bom-engine
docker push your-username/ai-bom-engine

# Deploy to your cloud provider
```

### Step 3: Deploy Backend

#### Using Render

1. Go to https://render.com
2. Click "New +" → "Web Service"
3. Connect GitHub repository
4. Select `backend` directory
5. Configure:
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
6. Add environment variables from `.env`
7. Click "Create Web Service"

#### Manual Deployment

```bash
# Build backend
cd backend
npm install --production

# Start with PM2
npm install -g pm2
pm2 start server.js --name "bom-backend"
```

### Step 4: Deploy Frontend

#### Using Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Navigate to frontend
cd frontend

# Build
npm run build

# Deploy
vercel --prod
```

#### Configure Environment

In Vercel dashboard, add environment variable:
```
REACT_APP_API_URL=https://your-backend-url.com/api
```

### Step 5: Update CORS Settings

After deployment, update backend `.env`:

```env
NODE_ENV=production
CORS_ORIGIN=https://your-frontend-url.vercel.app
```

---

##  Production Security Checklist

- [ ] Change all default secrets and passwords
- [ ] Use environment variables for all sensitive data
- [ ] Enable HTTPS on all services
- [ ] Set up rate limiting
- [ ] Configure MongoDB IP whitelist
- [ ] Enable MongoDB authentication
- [ ] Use strong JWT secrets (min 32 characters)
- [ ] Set secure cookie options
- [ ] Enable Helmet.js security headers
- [ ] Implement proper error handling (don't expose stack traces)
- [ ] Set up monitoring and logging
- [ ] Regular security updates for dependencies

---

##  Getting Help

If you encounter issues not covered here:

1. Check the [Troubleshooting](#troubleshooting) section
2. Review [API Documentation](API_DOCUMENTATION.md)
3. Check GitHub Issues
4. Contact team members

---

##  Success!

If you've completed all steps, your application should be:
-  Running locally on development environment
-  All services connected and healthy
-  Ready for development and testing

**Next Steps:**
- Read [Architecture Documentation](ARCHITECTURE.md)
- Check [API Documentation](API_DOCUMENTATION.md)
- Start building features!

---

**Last Updated**: October 14, 2025  
**Team**: Sarthak  
**Project**: AI-BOM-Converter
