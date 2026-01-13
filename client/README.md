# AI Intelligence Hub - Client

Modern React dashboard for managing and tracking leads from multiple sources.

## Features

- 🎨 Beautiful SaaS-style UI with Tailwind CSS
- 📊 Real-time lead dashboard with statistics
- 🔄 Live data fetching from backend API
- 🎯 Priority and status indicators
- ✨ AI-generated summaries display
- 📱 Fully responsive design
- 🎭 Smooth animations and transitions

## Tech Stack

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icons
- **Fetch API** - HTTP requests

## Getting Started

### Prerequisites

Make sure the backend server is running on `http://localhost:5000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file:
```bash
VITE_API_URL=http://localhost:5000
```

3. Start the development server:
```bash
npm run dev
```

The app will open at `http://localhost:5173`

## Project Structure

```
client/
├── public/              # Static assets
├── src/
│   ├── components/      # React components
│   │   ├── Dashboard.jsx    # Main dashboard
│   │   ├── LeadCard.jsx     # Lead card component
│   │   └── StatsCard.jsx    # Statistics card
│   ├── App.jsx          # Main app component
│   ├── App.css          # Custom styles
│   ├── index.css        # Tailwind directives
│   └── main.jsx         # Entry point
├── index.html           # HTML template
├── package.json         # Dependencies
├── tailwind.config.js   # Tailwind configuration
├── postcss.config.js    # PostCSS configuration
└── vite.config.js       # Vite configuration
```

## Features Overview

### Dashboard

- **Stats Cards**: Display total leads, new leads, contacted leads, and high-priority leads
- **Lead Cards**: Beautiful cards showing:
  - Source of the lead
  - Original message content
  - AI-generated summary
  - Priority level (Low/Medium/High)
  - Status (New/Contacted)
  - Creation timestamp
- **Refresh Button**: Manually fetch latest leads
- **Auto-refresh**: Automatically loads leads on mount

### Design System

- **Color Scheme**: Modern gradient backgrounds with blue and indigo accent colors
- **Typography**: Clean, readable fonts with proper hierarchy
- **Cards**: Elevated cards with hover effects and smooth shadows
- **Icons**: Lucide icons for consistent visual language
- **Responsive**: Mobile-first design that works on all screen sizes

## API Integration

The dashboard fetches data from:

- `GET /api/leads` - Fetch all leads
- `POST /api/webhook` - Create new lead (used by n8n)

## Demo Mode

If the API is not available, the dashboard automatically shows demo data so you can preview the UI.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Lint code

## Customization

### Colors

Edit `tailwind.config.js` to customize the color palette.

### Components

All components are in `src/components/` and can be easily modified or extended.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

ISC
