#!/bin/bash

# =======================================================
# ZIVAH International - Simple Deployment Script
# =======================================================

echo "🚀 ZIVAH International - Simple Deployment"
echo "==========================================="

# 1. Build the application in production mode
echo "📦 Building application in production..."
npm run build

# 2. Create deployment directory
echo "📁 Preparing deployment files..."
rm -rf deploy 2>/dev/null
mkdir -p deploy

# 3. Copy essential files only
echo "📋 Copying essential files..."

# Core files
cp package.json deploy/
cp server.js deploy/
cp next.config.ts deploy/

# Essential files (no .next folder for cPanel)
cp -r public deploy/
cp -r src deploy/
cp -r prisma deploy/

# 4. Clean unnecessary files
echo "🧹 Cleaning unnecessary files..."
find ./deploy -name "*.pack*" -delete 2>/dev/null || true
find ./deploy -name "*.gz" -delete 2>/dev/null || true
find ./deploy -name "*.map" -delete 2>/dev/null || true
find ./deploy -name "*tsbuildinfo*" -delete 2>/dev/null || true
find ./deploy -name "*.log" -delete 2>/dev/null || true
find ./deploy -name "*.old" -delete 2>/dev/null || true

# Count final files
FINAL_COUNT=$(find ./deploy -type f | wc -l)
echo "📊 Final file count: $FINAL_COUNT (cleaned)"

# 5. Create archive
echo "📦 Creating deployment archive..."
cd deploy && tar -czf ../zivah-deploy.tar.gz * && cd ..

# 7. Load FTP configuration from .env.production
echo "📡 Preparing FTP upload..."

# Load environment variables from .env.production
if [ -f ".env.production" ]; then
    export $(grep -v '^#' .env.production | xargs)
else
    echo "❌ .env.production file not found!"
    echo "Please create .env.production with FTP configuration:"
    echo "FTP_HOST=ftp.zivahinternational.com"
    echo "FTP_USER=zivahint"
    echo "FTP_PASSWORD=your-password"
    echo "FTP_PATH=/public_html/nextjs"
    exit 1
fi

# Set FTP defaults if not defined
FTP_HOST=${FTP_HOST:-"ftp.zivahinternational.com"}
FTP_USER=${FTP_USER:-"zivahint"}
FTP_PATH=${FTP_PATH:-"/public_html/nextjs"}

# Check if FTP password is available
if [ -z "$FTP_PASSWORD" ]; then
    echo "❌ FTP_PASSWORD not found in .env.production file"
    echo "Please add FTP_PASSWORD=your-password to your .env.production file"
    exit 1
fi

echo "🔄 Auto-uploading to $FTP_HOST as $FTP_USER..."

# Check if curl is available for FTP upload
if command -v curl &> /dev/null; then
    if [ -f "zivah-deploy.tar.gz" ]; then
        SIZE=$(du -h zivah-deploy.tar.gz | cut -f1)
        echo "📦 Uploading zivah-deploy.tar.gz ($SIZE)..."

        if curl -T zivah-deploy.tar.gz "ftp://$FTP_HOST$FTP_PATH/" --user "$FTP_USER:$FTP_PASSWORD" --ftp-create-dirs; then
            echo "✅ Upload successful! Extract in cPanel File Manager."
            echo ""
            echo "📋 Next steps:"
            echo "1. Login to cPanel File Manager"
            echo "2. Navigate to $FTP_PATH"
            echo "3. Extract zivah-deploy.tar.gz"
            echo "4. Configure Node.js app (startup: server.js)"
            echo "5. Set environment variables in cPanel"
            echo "6. Start your application"
        else
            echo "❌ Upload failed!"
            echo "📁 Manual upload available from: ./deploy/"
        fi
    else
        echo "❌ Archive file not found"
        echo "📁 Manual upload from: ./deploy/"
    fi
else
    echo "❌ curl not found. Please install curl for FTP upload or upload manually."
    echo "📁 Files ready for manual upload in: ./deploy/"
fi


