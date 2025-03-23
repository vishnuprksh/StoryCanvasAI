# StoryCanvas

StoryCanvas is an AI-powered creative writing tool that helps you create stories with the help of AI-generated content and idea management.

![StoryCanvas](generated-icon.png)

## Features

- **Rich Text Editor**: A beautiful, distraction-free writing environment
- **AI-Powered Content Generation**: Generate creative content based on your prompts
- **Idea Management**: Create, organize, and track ideas for your stories
- **Dynamic Idea Highlighting**: Ideas are automatically highlighted in your story text
- **Animated Text Generation**: Watch as AI-generated content appears with a typewriter effect
- **Multiple Writing Styles**: Generate content in detailed, concise, or poetic styles

## Quick Start Guide

### Prerequisites

- Node.js 18+ or Bun runtime
- An OpenAI API key (for AI content generation features)

### Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/storycanvas.git
   cd storycanvas
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up your environment variables
   Create a `.env` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Start the development server
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:5000`

### Using StoryCanvas

1. **Create or Select a Story**: Choose an existing story or create a new one
2. **Manage Ideas**: Use the ideas panel to add characters, locations, plot points, and more
3. **Generate Content**: Enter a prompt, select a style, and let AI help you write
4. **Edit and Save**: Your work is automatically saved as you type

## Tech Stack

### Frontend
- React with TypeScript
- TailwindCSS + ShadCN UI
- Tiptap Rich Text Editor
- TanStack React Query
- Wouter for routing

### Backend
- Node.js with Express
- OpenAI API integration
- In-memory storage (for demo purposes)
- Drizzle ORM with Zod validation

## Project Structure

```
├── client/             # Frontend React application
│   ├── src/
│   │   ├── components/ # UI components
│   │   ├── hooks/      # Custom React hooks
│   │   ├── lib/        # Utility functions
│   │   ├── pages/      # Page components
│   │   └── App.tsx     # Main application component
│
├── server/             # Backend Express application
│   ├── lib/            # Server utilities
│   ├── index.ts        # Entry point
│   ├── routes.ts       # API routes
│   └── storage.ts      # Data storage implementation
│
└── shared/             # Shared code between frontend and backend
    └── schema.ts       # TypeScript type definitions
```

## API Endpoints

- `GET /api/stories` - Get all stories
- `GET /api/stories/:id` - Get a specific story
- `POST /api/stories` - Create a new story
- `PUT /api/stories/:id` - Update a story
- `DELETE /api/stories/:id` - Delete a story
- `GET /api/stories/:storyId/ideas` - Get ideas for a story
- `POST /api/ideas` - Create a new idea
- `PUT /api/ideas/:id` - Update an idea
- `DELETE /api/ideas/:id` - Delete an idea
- `POST /api/stories/:storyId/generate` - Generate content for a story

## AI Content Generation

StoryCanvas uses the OpenAI GPT-4o model to generate creative writing content based on your prompts and ideas. When generating content:

1. Choose a generation style (detailed, concise, or poetic)
2. Optionally include your active ideas in the generation
3. Write a prompt describing what you want to generate
4. Watch as the AI writes your content with a typewriter animation effect

## Troubleshooting

- **API Key Issues**: Ensure your OpenAI API key is correctly set in the `.env` file
- **Rate Limiting**: If you encounter "too many requests" errors, wait a bit before trying again (OpenAI has rate limits)
- **Content Not Generating**: Check your browser console for any error messages

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.