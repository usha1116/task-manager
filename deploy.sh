#!/bin/bash

# TaskFlow MERN Stack Deployment Script
# This script helps you deploy your application to GitHub and Vercel

echo "🚀 TaskFlow MERN Stack Deployment Script"
echo "========================================"

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

echo "✅ Prerequisites check passed!"

# Function to check if repository exists
check_repo() {
    if git remote -v | grep -q "origin"; then
        return 0
    else
        return 1
    fi
}

# Function to push to GitHub
push_to_github() {
    echo "📤 Pushing to GitHub..."
    
    if ! check_repo; then
        echo "❌ No remote repository found."
        echo "Please add your GitHub repository as origin first:"
        echo "git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
        return 1
    fi
    
    git add .
    git commit -m "Deploy: Update for production deployment"
    git push origin main
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully pushed to GitHub!"
    else
        echo "❌ Failed to push to GitHub. Please check your credentials and try again."
        return 1
    fi
}

# Function to build client
build_client() {
    echo "🔨 Building client application..."
    
    cd client
    
    # Install dependencies
    echo "📦 Installing client dependencies..."
    npm install
    
    if [ $? -ne 0 ]; then
        echo "❌ Failed to install client dependencies."
        return 1
    fi
    
    # Build the application
    echo "🏗️  Building client application..."
    npm run build
    
    if [ $? -eq 0 ]; then
        echo "✅ Client build successful!"
    else
        echo "❌ Client build failed. Please check for errors."
        return 1
    fi
    
    cd ..
}

# Function to check Vercel CLI
check_vercel() {
    if ! command -v vercel &> /dev/null; then
        echo "⚠️  Vercel CLI is not installed."
        echo "Installing Vercel CLI..."
        npm install -g vercel
        
        if [ $? -ne 0 ]; then
            echo "❌ Failed to install Vercel CLI."
            return 1
        fi
    fi
    
    echo "✅ Vercel CLI is available!"
    return 0
}

# Function to deploy to Vercel
deploy_to_vercel() {
    echo "🎨 Deploying to Vercel..."
    
    if ! check_vercel; then
        return 1
    fi
    
    cd client
    
    echo "🚀 Starting Vercel deployment..."
    echo "Please follow the prompts:"
    echo "- Set up and deploy: Yes"
    echo "- Which scope: Select your account"
    echo "- Link to existing project: No"
    echo "- Project name: taskflow-frontend"
    echo "- Directory: ./"
    echo "- Override settings: No"
    
    vercel --prod
    
    if [ $? -eq 0 ]; then
        echo "✅ Successfully deployed to Vercel!"
        echo "🌐 Your app is now live!"
    else
        echo "❌ Vercel deployment failed."
        return 1
    fi
    
    cd ..
}

# Main deployment flow
main() {
    echo ""
    echo "Choose an option:"
    echo "1. Push to GitHub only"
    echo "2. Build client only"
    echo "3. Deploy to Vercel only"
    echo "4. Full deployment (GitHub + Build + Vercel)"
    echo "5. Exit"
    echo ""
    read -p "Enter your choice (1-5): " choice
    
    case $choice in
        1)
            push_to_github
            ;;
        2)
            build_client
            ;;
        3)
            deploy_to_vercel
            ;;
        4)
            echo "🚀 Starting full deployment..."
            push_to_github && build_client && deploy_to_vercel
            ;;
        5)
            echo "👋 Goodbye!"
            exit 0
            ;;
        *)
            echo "❌ Invalid choice. Please try again."
            main
            ;;
    esac
}

# Run the main function
main

echo ""
echo "🎉 Deployment script completed!"
echo ""
echo "📋 Next steps:"
echo "1. Set up your backend deployment (Render/Railway/Heroku)"
echo "2. Configure MongoDB Atlas database"
echo "3. Set environment variables in your deployment platforms"
echo "4. Test your deployed application"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md"
