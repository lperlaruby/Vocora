# Vocora

This is my improved version of Vocora, originally built as my senior project in a group. I've made changes to the platform with new features including daily streak tracking, some UI changes, and some database changes.

## What's New

This iteration builds upon my original senior project with several major improvements:
- **Daily Streak System**: Visual streak counter
- **Enhanced User Experience**: Redesigned navigation

## Features

**Language Learning Tools**
- AI-powered story generator that creates custom stories using your vocabulary words
- Writing practice with real-time AI feedback on grammar and style
- Vocabulary list management with word definitions and examples
- Text-to-speech functionality for pronunciation practice
- Story saving system to keep track of your favorite generated content

**User Experience**
- Multi-language interface (English, Spanish, Chinese)
- Daily streak tracking to maintain learning momentum
- Google OAuth authentication for easy sign-up
- Dark and light theme options
- Responsive design that works on all devices

**Story Generator Features**
- Choose from short, medium, or long story lengths
- AI-generated images that match your stories
- Interactive vocabulary highlighting within stories
- Save and revisit your favorite stories
- Hover over words for instant definitions

## Tech Stack

Built with modern web technologies for performance and scalability:

- **Frontend**: Next.js 14 with React 18 and TypeScript
- **Styling**: Tailwind CSS with Shadcn/UI component library
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with Google OAuth
- **AI Services**: OpenAI GPT, Google Generative AI, and Fireworks AI
- **Deployment**: Vercel
- **Testing**: Cypress for end-to-end testing


## Getting Started

The easiest way to try Vocora is to visit the live application at [vocora-theta.vercel.app](https://vocora-theta.vercel.app).

### Running Locally

If you want to run the project locally or contribute:

**Prerequisites:**
- Node.js (v18+)
- A Supabase account
- API keys for OpenAI, Google AI, and Fireworks AI

**Setup:**
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/your-username/vocora.git
   cd vocora
   npm install
   ```

2. Create a `.env.local` file with your API keys:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   OPENAI_API_KEY=your_openai_api_key
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_key
   FIREWORKS_API_KEY=your_fireworks_api_key
   ```

3. Set up your Supabase database with the necessary tables for users, stories, and preferences.

4. Run the development server:
   ```bash
   npm run dev
   ```

The app will be available at `http://localhost:3000`.

## Project Structure

The codebase is organized using Next.js App Router with a clear separation of concerns:

- `app/` - Main application pages and routing
- `components/` - Reusable UI components and Shadcn/UI elements
- `hooks/` - Custom React hooks for state management and API calls
- `lang/` - Internationalization files for English, Spanish, and Chinese
- `lib/` - Utility functions and API configurations
- `src/pages/api/` - Additional API routes for AI integrations