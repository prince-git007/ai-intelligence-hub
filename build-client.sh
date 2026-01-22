#!/bin/bash
# Build script for React client Docker image

echo "🔨 Building AI Intelligence Hub Client..."
echo ""

cd client

# Build the Docker image
docker build \
  --build-arg VITE_API_URL=http://server:5000/api \
  -t ai-hub-client:latest .

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ Build successful!"
    echo ""
    echo "To run the container:"
    echo "  docker run -d -p 80:80 --name ai-hub-client ai-hub-client:latest"
    echo ""
    echo "Or use docker-compose:"
    echo "  docker-compose up -d client"
else
    echo ""
    echo "❌ Build failed!"
    exit 1
fi
