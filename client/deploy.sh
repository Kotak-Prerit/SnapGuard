#!/bin/bash

# SnapGuard Client Deployment Script for Vercel

echo "🚀 Preparing SnapGuard Client for Vercel Deployment"
echo "================================================="

# Check if we're in the client directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the client directory."
    exit 1
fi

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build the project
echo "🔨 Building the project..."
npm run build

# Check if build was successful
if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    echo ""
    echo "🌐 Ready for Vercel deployment!"
    echo ""
    echo "Next steps:"
    echo "1. Install Vercel CLI: npm i -g vercel"
    echo "2. Login to Vercel: vercel login"
    echo "3. Deploy: vercel --prod"
    echo ""
    echo "Or deploy directly from GitHub:"
    echo "1. Push your code to GitHub"
    echo "2. Connect your repository to Vercel"
    echo "3. Set environment variables in Vercel dashboard"
    echo ""
    echo "Environment Variables to set in Vercel:"
    echo "- VITE_SUPABASE_URL"
    echo "- VITE_SUPABASE_ANON_KEY" 
    echo "- VITE_GROQ_API"
else
    echo "❌ Build failed. Please check the errors above."
    exit 1
fi
