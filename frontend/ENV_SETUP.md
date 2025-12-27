# Environment Setup Guide

## Creating .env File

1. Copy the `env.template` file to `.env`:
   ```bash
   cp env.template .env
   ```

   Or on Windows:
   ```powershell
   Copy-Item env.template .env
   ```

2. Update the values in `.env` as needed:

   ```env
   # Application Configuration
   VITE_APP_NAME=Tracker Application
   VITE_APP_PORT=5000

   # Backend API Configuration
   VITE_API_BASE_URL=http://localhost:8000/api

   # Environment
   VITE_ENV=development
   ```

## Environment Variables

- **VITE_APP_NAME**: Name of the application (used in title)
- **VITE_APP_PORT**: Port on which the frontend dev server runs (default: 5000)
- **VITE_API_BASE_URL**: Base URL for the backend API (default: http://localhost:8000/api)
- **VITE_ENV**: Environment name (development/production)

## Important Notes

- All Vite environment variables must be prefixed with `VITE_` to be accessible in the application
- The `.env` file is gitignored and should not be committed to version control
- Use `.env.example` or `env.template` as a template for other developers

