# Fullstack Monorepo: Next.js + NestJS

This repository contains both the frontend (Next.js) and backend (NestJS) for the Website Idea Generator project.

## What does this project do?

**Website Idea Generator** is a fullstack AI-powered tool that helps you quickly generate, preview, and edit modern website section ideas:

- **Submit your website idea** (e.g., "clothes store", "portfolio for designer").
- The backend uses Gemini AI to generate relevant website sections and modern HTML for each section, with real Unsplash images and beautiful, accessible design.
- The frontend displays your generated website sections in a live preview, lets you view the code, and copy or edit any section instantly.
- All ideas are saved, so you can revisit, update, or delete them at any time.

**Tech highlights:**

- Next.js 15 frontend (React, shadcn/ui, Jotai, React Hook Form, Zod)
- NestJS backend (Gemini AI, Unsplash, MongoDB)
- Real Unsplash images, modern HTML/CSS, and live section editing
- Full CRUD for website ideas and sections

## Project Structure

```
my-app/         # Next.js 15 frontend (React, shadcn/ui, Jotai, React Hook Form, Zod)
nest-project/   # NestJS backend (Gemini AI, Unsplash, MongoDB)
```

## Getting Started

### Prerequisites

- Node.js (18+ recommended)
- pnpm (recommended) or npm/yarn
- MongoDB (local or cloud)

### Setup

#### 1. Clone the repository

```sh
git clone <your-repo-url>
cd <repo-root>
```

#### 2. Install dependencies (from the root)

```sh
cd my-app && pnpm install
cd ../nest-project && pnpm install
```

#### 3. Environment Variables

- Copy `.env.example` to `.env` in both `my-app` and `nest-project` and fill in the required values (API keys, DB connection, etc).

#### 4. Run the apps

- **Frontend (Next.js):**
  ```sh
  cd my-app
  pnpm dev
  # or npm run dev
  ```
- **Backend (NestJS):**
  ```sh
  cd nest-project
  pnpm start:dev
  # or npm run start:dev
  ```

## Features

- Modern Next.js 15 frontend with SSR, shadcn/ui, Jotai, React Hook Form, Zod
- NestJS backend with Gemini AI integration, Unsplash API, MongoDB
- Full CRUD for website ideas and sections
- Real Unsplash images, modern HTML/CSS, and live section editing

## Monorepo Tips

- Each project manages its own dependencies and scripts.
- You can use [pnpm workspaces](https://pnpm.io/workspaces) for advanced monorepo management.

## License

MIT
