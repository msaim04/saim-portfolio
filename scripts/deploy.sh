#!/bin/bash
set -e

APP_DIR="$(pwd)"

echo "🚀 Starting deployment..."

cd "$APP_DIR"

echo "📦 Pulling latest changes already synced by rsync..."

echo "🛑 Stopping old containers..."
docker compose down

echo "🏗️ Building and starting containers..."
docker compose up -d --build

echo "⏳ Waiting for services to initialize..."
sleep 20

echo "📋 Running container status check..."
docker compose ps

echo "🩺 Checking backend health..."
curl -f http://localhost:5000/api/health || {
  echo "❌ Health check failed"
  docker compose logs --tail=100
  exit 1
}

echo "✅ Deployment successful"