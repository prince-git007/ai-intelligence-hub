# Production Setup Guide - AI Intelligence Hub

This guide covers the production-ready features and configuration for the AI Intelligence Hub.

## 🚀 Production Features

### Security
- ✅ **Helmet.js** - Security headers (XSS protection, content security policy, etc.)
- ✅ **CORS** - Configurable cross-origin resource sharing
- ✅ **Input Validation** - Express-validator for request validation
- ✅ **Rate Limiting** - (Can be added with express-rate-limit)

### API Features
- ✅ **Versioned API** - `/api/v1/leads` endpoint
- ✅ **Robust Validation** - Comprehensive input validation
- ✅ **Error Handling** - Proper error responses
- ✅ **Pagination** - GET endpoint supports pagination
- ✅ **Filtering** - Filter by status, priority, source
- ✅ **Sorting** - Sort by any field

### AI Integration
- ✅ **OpenAI Support** - GPT-3.5-turbo or GPT-4
- ✅ **Groq Support** - Free alternative (faster, recommended)
- ✅ **Auto-Summarization** - Automatic AI summaries for leads
- ✅ **Priority Detection** - Optional AI-powered priority determination

### Real-Time Updates
- ✅ **Polling** - Frontend polls for new leads every 5 seconds
- ✅ **Live Indicator** - Visual indicator when updates are active
- ✅ **Manual Refresh** - Manual refresh button
- ✅ **Pause/Resume** - Toggle real-time updates

### Docker & Infrastructure
- ✅ **Restart Policies** - All services use `restart: always`
- ✅ **Health Checks** - Health checks for all services
- ✅ **Dependency Management** - Services wait for dependencies
- ✅ **Multi-stage Builds** - Optimized Docker images

## 📋 Environment Variables

### Server (.env)

```bash
# Server Configuration
PORT=5000
NODE_ENV=production

# MongoDB
MONGODB_URI=mongodb://mongodb:27017/ai-intelligence-hub

# CORS (comma-separated for multiple origins)
CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# AI Provider: 'openai' or 'groq'
AI_PROVIDER=groq

# Groq API (Free - Recommended)
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=mixtral-8x7b-32768

# OpenAI API (Paid)
OPENAI_API_KEY=your_openai_api_key_here
OPENAI_MODEL=gpt-3.5-turbo

# AI Features
ENABLE_AI_SUMMARY=true
ENABLE_AI_PRIORITY=false
```

### Client (.env)

```bash
VITE_API_URL=http://localhost:5000/api
```

## 🔑 Getting API Keys

### Groq (Free - Recommended)
1. Visit https://console.groq.com/
2. Sign up for a free account
3. Navigate to API Keys
4. Create a new API key
5. Copy and add to `.env`

**Benefits:**
- ✅ Free tier available
- ✅ Very fast responses
- ✅ Good quality summaries
- ✅ No credit card required

### OpenAI (Paid)
1. Visit https://platform.openai.com/
2. Sign up and add payment method
3. Navigate to API Keys
4. Create a new API key
5. Copy and add to `.env`

**Benefits:**
- ✅ Best quality (GPT-4)
- ✅ More model options
- ⚠️ Requires payment

## 🐳 Docker Production Deployment

### Build and Start

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Check status
docker-compose ps
```

### Health Checks

All services have health checks:

```bash
# Check MongoDB
docker inspect ai-hub-mongodb --format='{{.State.Health.Status}}'

# Check Server
curl http://localhost:5000/health

# Check Client
curl http://localhost/health
```

## 📡 API Endpoints

### POST /api/v1/leads

Create a new lead with AI summarization.

**Request:**
```json
{
  "source": "Website Contact Form",
  "message": "Hi, I'm interested in your services. Can we schedule a call?",
  "priority": "High",
  "status": "New"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "...",
    "source": "Website Contact Form",
    "originalContent": "Hi, I'm interested...",
    "aiSummary": "Interested prospect requesting call scheduling...",
    "priority": "High",
    "status": "New",
    "createdAt": "2026-01-13T...",
    "updatedAt": "2026-01-13T..."
  }
}
```

### GET /api/v1/leads

Get all leads with filtering, pagination, and sorting.

**Query Parameters:**
- `status` - Filter by status (New, Contacted)
- `priority` - Filter by priority (Low, Medium, High)
- `source` - Filter by source (partial match)
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 50)
- `sortBy` - Field to sort by (default: createdAt)
- `sortOrder` - asc or desc (default: desc)

**Example:**
```
GET /api/v1/leads?status=New&priority=High&page=1&limit=20&sortBy=createdAt&sortOrder=desc
```

**Response:**
```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 45,
    "pages": 3
  }
}
```

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` files
   - Use secrets management in production
   - Rotate API keys regularly

2. **CORS Configuration**
   - Set specific origins in production
   - Don't use wildcards (`*`)

3. **Rate Limiting**
   - Consider adding express-rate-limit
   - Protect against abuse

4. **HTTPS**
   - Use reverse proxy (nginx, traefik)
   - Enable SSL/TLS certificates

5. **Database Security**
   - Use MongoDB authentication in production
   - Enable network encryption
   - Regular backups

## 📊 Monitoring

### Health Endpoints

- **Server**: `http://localhost:5000/health`
- **Client**: `http://localhost/health`

### Logs

```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f server
docker-compose logs -f mongodb
```

## 🚀 Deployment Checklist

- [ ] Set all environment variables
- [ ] Configure CORS origins
- [ ] Set up API keys (Groq or OpenAI)
- [ ] Enable MongoDB authentication
- [ ] Configure reverse proxy (nginx/traefik)
- [ ] Set up SSL/TLS certificates
- [ ] Configure backups
- [ ] Set up monitoring/alerting
- [ ] Test all endpoints
- [ ] Load test the application
- [ ] Set up CI/CD pipeline

## 🔧 Troubleshooting

### AI Summarization Not Working

1. Check API key is set:
   ```bash
   echo $GROQ_API_KEY  # or $OPENAI_API_KEY
   ```

2. Check provider setting:
   ```bash
   echo $AI_PROVIDER
   ```

3. Check logs:
   ```bash
   docker-compose logs server | grep -i "ai"
   ```

### MongoDB Connection Issues

1. Check MongoDB is running:
   ```bash
   docker-compose ps mongodb
   ```

2. Check connection string:
   ```bash
   echo $MONGODB_URI
   ```

3. Test connection:
   ```bash
   docker-compose exec mongodb mongosh ai-intelligence-hub
   ```

### Frontend Not Updating

1. Check API URL:
   ```bash
   # In browser console
   console.log(import.meta.env.VITE_API_URL)
   ```

2. Check CORS configuration
3. Check browser console for errors
4. Verify polling is enabled (green "Live" indicator)

## 📚 Additional Resources

- [Groq API Documentation](https://console.groq.com/docs)
- [OpenAI API Documentation](https://platform.openai.com/docs)
- [Express Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

---

**Ready for Production!** 🎉
