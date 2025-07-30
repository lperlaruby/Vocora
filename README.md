# Vocora

Vocora is a language reforcement web application designed to help users improve their language skills through AI-powered story generation. The platform offers features such as vocabulary practice, writing feedback, reading comprehension, and more.

## Features

- User authentication (login/signup)
- Vocabulary wordlist
- AI-powered chat practice
- AI-powered story generator
- Saved progress and personalized settings

## Tech Stack

- **Frontend:** Next.js (React), TypeScript, Tailwind CSS
- **Backend:** Next.js API routes
- **Database:** Supabase
- **State Management:** React Context, custom hooks
- **Styling:** Tailwind CSS
- **Testing:** Cypress (end-to-end)
- **Other:** Shadcn UI components, custom UI components

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) (comes with Node.js)

### Installation

1. Clone the repository:

   git clone https://github.com/your-username/vocora.git

   cd vocora


2. Install dependencies:
 
   npm install


3. Set up environment variables as needed (see `.env.example` if available).

### Running the Development Server

Start the development server with:

npm run dev


The app will be available at [http://localhost:3000](http://localhost:3000).

## Folder Structure

- `app/` - Main application pages and routes
- `components/` - Reusable UI components
- `hooks/` - Custom React hooks
- `lang/` - Localization and language files
- `lib/` - Utility libraries and API clients
- `public/` - Static assets
- `src/pages/api/` - API routes
- `test/` - Cypress end-to-end tests
