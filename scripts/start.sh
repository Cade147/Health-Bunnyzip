#!/bin/bash
set -e

echo "🚀 Starting Health Bunny AI..."

# Install dependencies if not already done
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  pnpm install
fi

# Start the frontend development server
echo "🎨 Starting frontend on port 8080..."
cd artifacts/health-bunny
pnpm run dev
