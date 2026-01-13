# AI Intelligence Hub - Server

Backend API server for the AI Intelligence Hub project.

## Features

- RESTful API built with Express.js
- MongoDB database with Mongoose ODM
- Webhook endpoint for n8n integration
- Lead management system with priority and status tracking

## Installation

1. Install dependencies:
```bash
npm install
```

2. Configure environment variables:
Create a `.env` file in the server directory with the following variables:
```
MONGODB_URI=mongodb://localhost:27017/ai-intelligence-hub
PORT=5000
```

3. Start MongoDB:
Make sure MongoDB is running on your system.

4. Run the server:
```bash
npm start
```

## API Endpoints

### Get All Leads

**GET** `/api/leads`

Fetches all leads from the database, sorted by most recent first.

**Response (Success - 200):**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "source": "...",
      "originalContent": "...",
      "aiSummary": "...",
      "priority": "Medium",
      "status": "New",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

### Create Lead (Webhook)

**POST** `/api/webhook`
**POST** `/api/leads`

Receives data from n8n and creates a new lead in the database.

**Request Body:**
```json
{
  "source": "string (required)",
  "originalContent": "string (required)",
  "aiSummary": "string (optional)",
  "priority": "Low | Medium | High (optional, default: Medium)",
  "status": "New | Contacted (optional, default: New)"
}
```

**Response (Success - 201):**
```json
{
  "success": true,
  "message": "Lead created successfully",
  "data": {
    "_id": "...",
    "source": "...",
    "originalContent": "...",
    "aiSummary": "...",
    "priority": "Medium",
    "status": "New",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

**Response (Error - 400):**
```json
{
  "success": false,
  "message": "Source and originalContent are required fields"
}
```

### Update Lead Status

**PATCH** `/api/leads/:id`

Updates the status or priority of a specific lead.

**Request Body:**
```json
{
  "status": "Contacted",
  "priority": "High"
}
```

**Response (Success - 200):**
```json
{
  "success": true,
  "message": "Lead updated successfully",
  "data": {
    "_id": "...",
    "status": "Contacted",
    "priority": "High",
    ...
  }
}
```

### Health Check

**GET** `/health`

Returns the server status.

**Response:**
```json
{
  "status": "ok",
  "message": "AI Intelligence Hub API is running"
}
```

## Lead Model Schema

- **source** (String, required): Source of the lead
- **originalContent** (String, required): Original content/message
- **aiSummary** (String): AI-generated summary
- **priority** (String): Low, Medium, or High (default: Medium)
- **status** (String): New or Contacted (default: New)
- **timestamps**: Automatically added createdAt and updatedAt fields

## Project Structure

```
server/
├── config/
│   └── db.js           # MongoDB connection configuration
├── models/
│   └── Lead.js         # Lead model schema
├── routes/
│   └── webhook.js      # Webhook routes
├── .env                # Environment variables (not in git)
├── .env.example        # Example environment variables
├── .gitignore          # Git ignore file
├── index.js            # Main server file
├── package.json        # NPM dependencies
└── README.md           # This file
```

## Development

The server runs on port 5000 by default (or the PORT specified in .env).

To test the webhook endpoint, you can use curl or any API client:

```bash
curl -X POST http://localhost:5000/api/webhook \
  -H "Content-Type: application/json" \
  -d '{
    "source": "Website Contact Form",
    "originalContent": "Hi, I am interested in your services.",
    "priority": "High"
  }'
```

## Notes

- Make sure MongoDB is installed and running before starting the server
- The `.env` file should never be committed to version control
- Use `.env.example` as a template for creating your `.env` file
