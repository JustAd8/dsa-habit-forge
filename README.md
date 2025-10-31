# DSA Habit Forge

A comprehensive DSA (Data Structures & Algorithms) practice tracking application with smart alarm notifications.

## Features

- **Smart Alarm System**: Set recurring alarms for DSA practice sessions
- **Progress Tracking**: Monitor your daily practice habits
- **Browser Notifications**: Real-time notifications when alarms trigger
- **Email Notifications**: Optional email alerts via EmailJS
- **Cloud Database**: MongoDB Atlas integration for data persistence
- **User Authentication**: Secure login/signup with Supabase
- **Responsive Design**: Modern UI built with React and Tailwind CSS

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: shadcn/ui, Radix UI, Tailwind CSS
- **Databases**: Supabase (auth), MongoDB Atlas (data)
- **Notifications**: Browser API, EmailJS
- **State Management**: React Query, Context API

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd dsa-habit-forge
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_key
MONGODB_URI=your_mongodb_atlas_uri
VITE_EMAILJS_SERVICE_ID=your_emailjs_service_id
VITE_EMAILJS_TEMPLATE_ID=your_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=your_emailjs_public_key
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

This project is configured for deployment on Vercel. Simply connect your GitHub repository to Vercel and deploy.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request
