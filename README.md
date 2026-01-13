# AI Intelligence Hub

A full-stack application for managing and tracking leads from multiple sources with AI-powered summaries.

## 🚀 Features

### Backend (Node.js + Express + MongoDB)
- RESTful API with Express.js
- MongoDB database with Mongoose ODM
- Webhook endpoint for n8n integration
- Lead management with priority and status tracking
- CORS-enabled for cross-origin requests

### Frontend (React + Vite + Tailwind CSS)
- Modern SaaS-style dashboard UI
- Real-time lead statistics
- Beautiful lead cards with priority indicators
- AI summary display
- Responsive design
- Lucide icons for consistent visual language

## 📁 Project Structure

```
ai-intelligence-hub/
├── server/                 # Backend Node.js application
│   ├── config/            # Database configuration
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── index.js           # Server entry point
│   └── package.json       # Backend dependencies
│
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── App.jsx       # Main app component
│   │   └── main.jsx      # Entry point
│   ├── index.html        # HTML template
│   └── package.json      # Frontend dependencies
│
└── README.md             # This file
```

## 🛠️ Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- dotenv for environment variables
- CORS for cross-origin requests

### Frontend
- React 18
- Vite (build tool)
- Tailwind CSS
- Lucide React (icons)
- Fetch API

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud instance)

## 🚀 Getting Started

You can run this project in two ways:

### Option 1: Docker (Recommended) 🐳

**Quick start with Docker Compose:**

```bash
docker-compose up -d
```

This will start:
- MongoDB on port 27017
- Backend API on port 5000
- n8n on port 5678

**Access the services:**
- API: http://localhost:5000
- n8n: http://localhost:5678 (login: admin/admin123)

See [DOCKER.md](DOCKER.md) for complete Docker documentation.

### Option 2: Manual Setup

#### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd ai-intelligence-hub
```

#### 2. Setup Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
MONGODB_URI=mongodb://localhost:27017/ai-intelligence-hub
PORT=5000
```

Start the server:

```bash
npm start
```

The server will run on `http://localhost:5000`

### 3. Setup Frontend

```bash
cd client
npm install
```

Start the development server:

```bash
npm run dev
```

The client will run on `http://localhost:5173`

## 📡 API Endpoints

### Leads Management

#### Get All Leads
```http
GET /api/leads
```

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [...]
}
```

#### Create Lead (Webhook)
```http
POST /api/webhook
POST /api/leads
```

**Request Body:**
```json
{
  "source": "Website Contact Form",
  "originalContent": "Message content...",
  "aiSummary": "AI generated summary...",
  "priority": "High",
  "status": "New"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {...}
}
```

#### Update Lead
```http
PATCH /api/leads/:id
```

**Request Body:**
```json
{
  "status": "Contacted",
  "priority": "Medium"
}
```

### Health Check
```http
GET /health
```

## 🎨 Dashboard Features

### Statistics Cards
- **Total Leads**: Shows the total number of leads
- **New Leads**: Count of leads with "New" status
- **Contacted**: Count of leads that have been contacted
- **High Priority**: Count of high-priority leads

### Lead Cards
Each lead is displayed in a beautiful card showing:
- Source of the lead
- Original message content
- AI-generated summary
- Priority level (Low/Medium/High) with color coding
- Status (New/Contacted)
- Timestamp
- Quick action button

### Priority Levels
- 🔥 **High** - Red badge
- ⚡ **Medium** - Yellow badge
- 📝 **Low** - Green badge

## 🔧 Development

### Running in Development Mode

**Terminal 1 (Backend):**
```bash
cd server
npm start
```

**Terminal 2 (Frontend):**
```bash
cd client
npm run dev
```

### Building for Production

**Backend:**
```bash
cd server
# Already production-ready
```

**Frontend:**
```bash
cd client
npm run build
```

The build files will be in `client/dist/`

## 🔌 n8n Integration

To integrate with n8n:

1. Create a webhook node in n8n
2. Configure it to POST to: `http://localhost:5000/api/webhook`
3. Send data in the following format:

```json
{
  "source": "Your Source Name",
  "originalContent": "The lead message",
  "aiSummary": "AI-generated summary (optional)",
  "priority": "High",
  "status": "New"
}
```

## 📝 Environment Variables

### Server (.env)
```env
MONGODB_URI=mongodb://localhost:27017/ai-intelligence-hub
PORT=5000
```

### Client (.env) - Optional
```env
VITE_API_URL=http://localhost:5000
```

## 🎯 Lead Model Schema

```javascript
{
  source: String (required),
  originalContent: String (required),
  aiSummary: String,
  priority: Enum ['Low', 'Medium', 'High'] (default: 'Medium'),
  status: Enum ['New', 'Contacted'] (default: 'New'),
  createdAt: Date (auto),
  updatedAt: Date (auto)
}
```

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: `mongod` or check your cloud MongoDB connection
- Verify the MONGODB_URI in your `.env` file

### CORS Errors
- Make sure the server is running and CORS is enabled
- Check that the API URL in the client matches the server URL

### Port Already in Use
- Change the PORT in server's `.env` file
- Update VITE_API_URL in client if you change the backend port

## 📄 License

ISC

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📧 Support

For support, please open an issue in the GitHub repository.

---

Built with ❤️ using Node.js, React, and MongoDB
