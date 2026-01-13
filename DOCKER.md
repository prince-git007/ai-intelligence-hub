# Docker Setup Guide - AI Intelligence Hub

Run your entire AI Intelligence Hub stack with Docker Compose in just one command!

## 🐳 What's Included

This Docker setup includes three services:

1. **MongoDB** - Database for storing leads
2. **Node.js Server** - Your backend API
3. **n8n** - Workflow automation platform

All services run on a shared network called `ai-hub-network` and can communicate with each other.

## 📋 Prerequisites

- Docker installed ([Get Docker](https://docs.docker.com/get-docker/))
- Docker Compose installed (included with Docker Desktop)

## 🚀 Quick Start

### 1. Start All Services

From the project root directory:

```bash
docker-compose up -d
```

This will:
- Pull the MongoDB and n8n images
- Build your Node.js server
- Start all services in the background
- Create persistent volumes for data

### 2. Check Service Status

```bash
docker-compose ps
```

You should see all three services running:
- `ai-hub-mongodb` on port 27017
- `ai-hub-server` on port 5000
- `ai-hub-n8n` on port 5678

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f mongodb
docker-compose logs -f n8n
```

### 4. Access the Services

- **Backend API**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **n8n Interface**: http://localhost:5678
  - Username: `admin`
  - Password: `admin123`

## 🔧 Service Details

### MongoDB
- **Container**: `ai-hub-mongodb`
- **Port**: 27017
- **Database**: `ai-intelligence-hub`
- **Volume**: `ai-hub-mongodb-data`
- **Image**: `mongo:7.0`

### Node.js Server
- **Container**: `ai-hub-server`
- **Port**: 5000
- **Network Name**: `mongodb` (use this in connection string)
- **Volume**: Source code mounted for development

### n8n
- **Container**: `ai-hub-n8n`
- **Port**: 5678
- **Volume**: `ai-hub-n8n-data` (for workflows and credentials)
- **Image**: `n8nio/n8n:latest`
- **Default Login**: admin / admin123

## 🔗 Service Communication

Services communicate using Docker network names:

```
mongodb://mongodb:27017          (from server to MongoDB)
http://server:5000               (from n8n to server)
http://n8n:5678                  (from server to n8n)
```

## 📝 Common Commands

### Start Services
```bash
# Start in background
docker-compose up -d

# Start with logs
docker-compose up

# Start specific service
docker-compose up -d mongodb
```

### Stop Services
```bash
# Stop all
docker-compose stop

# Stop specific service
docker-compose stop server
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart server
```

### Stop and Remove Containers
```bash
docker-compose down
```

### Stop and Remove Everything (including volumes)
```bash
docker-compose down -v
```

### Rebuild Server After Code Changes
```bash
docker-compose up -d --build server
```

## 🔌 Setting Up n8n Webhook

1. Open n8n at http://localhost:5678
2. Login with `admin` / `admin123`
3. Create a new workflow
4. Add a "Webhook" node
5. Set the webhook URL to: `http://server:5000/api/webhook`
6. Add an HTTP Request node to send data:
   - Method: POST
   - URL: `http://server:5000/api/webhook`
   - Body:
   ```json
   {
     "source": "n8n Workflow",
     "originalContent": "{{$json.message}}",
     "aiSummary": "{{$json.summary}}",
     "priority": "High",
     "status": "New"
   }
   ```

## 🛠️ Development Mode

For development with hot-reload, you can modify the docker-compose.yml:

1. Keep the volumes mounted (already configured)
2. Install nodemon in the server:
   ```bash
   docker-compose exec server npm install --save-dev nodemon
   ```
3. Update the command to use nodemon:
   ```yaml
   command: npx nodemon index.js
   ```

## 🗄️ Database Access

### Access MongoDB Shell
```bash
docker-compose exec mongodb mongosh ai-intelligence-hub
```

### MongoDB Commands
```javascript
// List all collections
show collections

// Find all leads
db.leads.find().pretty()

// Count leads
db.leads.countDocuments()

// Find high-priority leads
db.leads.find({priority: "High"}).pretty()
```

## 🔐 Security Notes

### Change Default Credentials

For production, update in `docker-compose.yml`:

```yaml
n8n:
  environment:
    - N8N_BASIC_AUTH_USER=your-username
    - N8N_BASIC_AUTH_PASSWORD=your-secure-password
```

### MongoDB Authentication

For production, add authentication:

```yaml
mongodb:
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: your-secure-password
```

Then update the connection string:
```
mongodb://admin:your-secure-password@mongodb:27017/ai-intelligence-hub
```

## 📊 Monitoring

### Check Container Resource Usage
```bash
docker stats
```

### Check Container Health
```bash
docker inspect ai-hub-mongodb --format='{{.State.Health.Status}}'
```

## 🐛 Troubleshooting

### Container Won't Start
```bash
# Check logs
docker-compose logs server

# Rebuild without cache
docker-compose build --no-cache server
docker-compose up -d
```

### MongoDB Connection Issues
```bash
# Check if MongoDB is healthy
docker-compose ps

# Test connection
docker-compose exec server sh
ping mongodb
```

### Port Already in Use
```bash
# Find what's using the port
netstat -ano | findstr :5000  # Windows
lsof -i :5000                 # Mac/Linux

# Change port in docker-compose.yml
ports:
  - "5001:5000"  # Use 5001 on host
```

### Reset Everything
```bash
# Stop and remove all containers, networks, and volumes
docker-compose down -v

# Remove all images
docker-compose down --rmi all

# Start fresh
docker-compose up -d --build
```

## 📦 Data Persistence

Data is stored in Docker volumes:

- **mongodb_data**: Database files
- **mongodb_config**: MongoDB configuration
- **n8n_data**: n8n workflows and settings

These volumes persist even when containers are stopped or removed.

### Backup Data
```bash
# Backup MongoDB
docker-compose exec mongodb mongodump --out /data/backup
docker cp ai-hub-mongodb:/data/backup ./backup

# Backup n8n workflows
docker cp ai-hub-n8n:/home/node/.n8n ./n8n-backup
```

### Restore Data
```bash
# Restore MongoDB
docker cp ./backup ai-hub-mongodb:/data/backup
docker-compose exec mongodb mongorestore /data/backup
```

## 🌐 Production Deployment

For production environments:

1. Use environment-specific compose files:
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
   ```

2. Add reverse proxy (nginx) for SSL/TLS

3. Set up proper logging and monitoring

4. Configure backups and disaster recovery

5. Use Docker secrets for sensitive data

## 📚 Additional Resources

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [n8n Documentation](https://docs.n8n.io/)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)

## 🤝 Support

If you encounter issues:
1. Check the logs: `docker-compose logs -f`
2. Verify network connectivity: `docker network inspect ai-hub-network`
3. Check container status: `docker-compose ps`

---

Built with 🐳 Docker
