# Quick Start Guide - AI Intelligence Hub

Get your AI Intelligence Hub up and running in 5 minutes!

## 🐳 Quickest Start: Docker (Recommended)

If you have Docker installed:

```bash
docker-compose up -d
```

That's it! Services will be available at:
- **Backend API**: http://localhost:5000
- **n8n Workflows**: http://localhost:5678 (admin/admin123)
- **Frontend**: (run separately - see below)

See [DOCKER.md](DOCKER.md) for details.

---

## 📦 Manual Setup

### Prerequisites

- ✅ Node.js installed (v16+)
- ✅ MongoDB installed and running
- ✅ npm or yarn

## Step 1: Start MongoDB

```bash
# Windows
mongod

# macOS/Linux
sudo systemctl start mongodb
# or
brew services start mongodb-community
```

## Step 2: Setup & Start Backend

Open Terminal 1:

```bash
cd server
npm install
```

Create `.env` file in the `server` folder:
```
MONGODB_URI=mongodb://localhost:27017/ai-intelligence-hub
PORT=5000
```

Start the server:
```bash
npm start
```

You should see:
```
Server is running on port 5000
MongoDB Connected: localhost
```

## Step 3: Setup & Start Frontend

Open Terminal 2:

```bash
cd client
npm install
npm run dev
```

You should see:
```
VITE v7.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Step 4: Open the Dashboard

Open your browser and visit:
```
http://localhost:5173
```

You should see a beautiful dashboard with demo leads!

## Step 5: Test the API

Test creating a lead via webhook:

```bash
curl -X POST http://localhost:5000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Test Source",
    "originalContent": "This is a test lead",
    "aiSummary": "Test AI summary",
    "priority": "High",
    "status": "New"
  }'
```

Click the Refresh button in the dashboard to see your new lead!

## 🎉 You're Done!

Your AI Intelligence Hub is now running:
- **Backend API**: http://localhost:5000
- **Frontend Dashboard**: http://localhost:5173

## Next Steps

### Integrate with n8n

1. Create a webhook node in n8n
2. Set URL to: `http://localhost:5000/api/webhook`
3. Configure your automation to send lead data

### Customize

- Modify colors in `client/tailwind.config.js`
- Add new fields to `server/models/Lead.js`
- Create new components in `client/src/components/`

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED
```
**Solution**: Make sure MongoDB is running

### Port Already in Use
```
Error: listen EADDRINUSE: address already in use :::5000
```
**Solution**: Change PORT in `server/.env` to a different port

### Can't Fetch Leads
**Solution**: 
- Check that backend is running on port 5000
- Open DevTools Console for error messages
- Verify CORS is enabled in backend

## Support

For issues, check:
- Server terminal output
- Browser console (F12)
- MongoDB connection status

Happy coding! 🚀
