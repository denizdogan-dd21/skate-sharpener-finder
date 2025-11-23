#!/bin/bash

# Skate Sharpener Finder - Quick Deployment Script
# This script helps you deploy to Vercel + Supabase

echo "🏒 Skate Sharpener Finder - Deployment Helper"
echo "=============================================="
echo ""

# Step 1: Check if git is initialized
if [ ! -d .git ]; then
    echo "📦 Initializing Git repository..."
    git init
    git add .
    git commit -m "Initial commit - Skate Sharpener Finder"
    echo "✅ Git repository initialized"
else
    echo "✅ Git repository already exists"
fi

echo ""
echo "📋 Next Steps:"
echo ""
echo "1. Create a Supabase project at https://supabase.com"
echo "   - Save your database password!"
echo "   - Get your DATABASE_URL and DIRECT_URL"
echo ""
echo "2. Create a GitHub repository:"
echo "   git remote add origin https://github.com/YOUR-USERNAME/skate-sharpener-app.git"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "3. Deploy database to Supabase:"
echo "   export DATABASE_URL='your-pooling-url'"
echo "   export DIRECT_URL='your-direct-url'"
echo "   npx prisma db push"
echo ""
echo "4. Deploy to Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repository"
echo "   - Add environment variables (see DEPLOYMENT_GUIDE.md)"
echo "   - Deploy!"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT_GUIDE.md"
echo ""
