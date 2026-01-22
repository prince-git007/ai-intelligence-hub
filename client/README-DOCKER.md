# Docker Setup for React Frontend

This document explains how to build and run the React frontend using Docker.

## 🐳 Dockerfile Overview

The Dockerfile uses a **multi-stage build** approach:

### Stage 1: Builder
- Uses `node:20-alpine` for a lightweight Node.js environment
- Installs dependencies
- Builds the production-ready React app using Vite

### Stage 2: Production Server
- Uses `nginx:alpine` for serving static files
- Copies the built files from the builder stage
- Serves on port 80

## 🚀 Building the Image

### Build locally:
```bash
cd client
docker build -t ai-hub-client .
```

### Build with custom API URL:
```bash
docker build \
  --build-arg VITE_API_URL=http://your-api-server:5000/api \
  -t ai-hub-client .
```

## 🏃 Running the Container

### Run standalone:
```bash
docker run -d \
  -p 80:80 \
  --name ai-hub-client \
  ai-hub-client
```

### Run with Docker Compose:
```bash
# From project root
docker-compose up -d client
```

## 🌐 Accessing the Application

Once running, access the application at:
- **http://localhost** (port 80)

## ⚙️ Configuration

### Environment Variables

The API URL can be configured at build time:

```dockerfile
ARG VITE_API_URL=http://localhost:5000/api
```

In `docker-compose.yml`, this is set to:
```yaml
VITE_API_URL: http://server:5000/api
```

This allows the frontend to communicate with the backend server using Docker's internal network.

### Nginx Configuration

The `nginx.conf` file includes:
- **SPA routing support** - All routes redirect to `index.html` for React Router
- **Gzip compression** - Reduces file sizes for faster loading
- **Static asset caching** - Caches images, CSS, JS for 1 year
- **Security headers** - Adds X-Frame-Options, X-Content-Type-Options, etc.
- **Health check endpoint** - `/health` for monitoring

## 📦 Production Build

The build process:
1. Installs all dependencies (`npm ci`)
2. Builds the React app (`npm run build`)
3. Outputs optimized static files to `/app/dist`
4. Copies to Nginx's HTML directory

## 🔧 Customization

### Change Port

Edit `docker-compose.yml`:
```yaml
ports:
  - "8080:80"  # Access on port 8080
```

### Update API URL

Edit `docker-compose.yml`:
```yaml
build:
  args:
    VITE_API_URL: http://your-api:5000/api
```

### Modify Nginx Config

Edit `client/nginx.conf` and rebuild:
```bash
docker-compose build client
docker-compose up -d client
```

## 🐛 Troubleshooting

### Container won't start
```bash
# Check logs
docker logs ai-hub-client

# Check if port 80 is in use
netstat -ano | findstr :80  # Windows
lsof -i :80                  # Mac/Linux
```

### API connection errors
- Verify the API URL is correct in `docker-compose.yml`
- Ensure both client and server are on the same Docker network
- Check server logs: `docker-compose logs server`

### Build fails
```bash
# Clean build
docker-compose build --no-cache client

# Check for syntax errors
docker build -t ai-hub-client . 2>&1 | tee build.log
```

## 📊 Image Size

The final image is optimized:
- **Builder stage**: ~500MB (discarded after build)
- **Final image**: ~50MB (Nginx + static files)

## 🔄 Updating the Application

After making code changes:

```bash
# Rebuild and restart
docker-compose build client
docker-compose up -d client

# Or use docker-compose up with rebuild
docker-compose up -d --build client
```

## 🌍 Production Deployment

For production:
1. Use a reverse proxy (nginx, traefik) for SSL/TLS
2. Set proper CORS headers
3. Configure CDN for static assets
4. Use environment-specific API URLs
5. Enable HTTPS

## 📚 Related Files

- `Dockerfile` - Multi-stage build configuration
- `nginx.conf` - Nginx server configuration
- `.dockerignore` - Files excluded from build context
- `docker-compose.yml` - Service orchestration
