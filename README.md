# Garden AI Snippet

A Next.js application that provides AI-powered gardening advice and product recommendations using Together AI.

## Features

- AI-powered gardening advice
- Product recommendations from Bauhaus catalog
- Location-based seasonal information
- Interactive chat interface

## Prerequisites

- Node.js 18+
- Together AI API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
TOGETHER_API_KEY=your_api_key
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Technologies Used

- Next.js
- React
- TypeScript
- Tailwind CSS
- Together AI API

## Project Structure

- `app/` - Next.js app router pages
- `components/` - React components
- `lib/` - Utility functions and data
- `services/` - AI and other services
- `types/` - TypeScript type definitions 