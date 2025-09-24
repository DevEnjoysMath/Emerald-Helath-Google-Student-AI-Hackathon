# Emerald AI Healthcare Assistant

An AI-powered healthcare platform designed to help users in Ireland check their symptoms and find healthcare practitioners. Built for the Google Hackathon, this project combines modern web technologies with AI to make healthcare more accessible.

## Features

### 1. AI-Powered Symptom Checker
- Natural language symptom description
- Photo upload capability for visible symptoms
- Instant AI analysis of potential conditions
- Severity assessment
- Direct GP communication feature

### 2. Practitioner Finder
- Location-based healthcare provider search
- Filter by health plan coverage
- Comprehensive provider information
- Save and manage healthcare contacts

## Tech Stack

- **Frontend**: Next.js 15.3.3, React 18, TypeScript
- **Styling**: TailwindCSS, Radix UI components
- **AI Integration**: Genkit AI framework, Google AI
- **Form Handling**: React Hook Form, Zod validation
- **Data Visualization**: Recharts
- **Authentication**: Custom auth system with local storage

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/emerald-ai-healthcare-assistant.git
cd emerald-ai-healthcare-assistant
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Environment Setup

Create a `.env.local` file in the root directory with the following variables:
```
# Add your environment variables here
```

## Project Structure

- `/src/app` - Next.js pages and routing
- `/src/components` - Reusable UI components
- `/src/ai` - AI integration and flows
- `/src/context` - React context providers
- `/src/lib` - Utility functions and configurations

## Contributing

This project was created for the Google Hackathon. Feel free to fork and submit pull requests.

## License

MIT License - see LICENSE file for details
