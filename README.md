# Impact Initiative Nepal

A purpose-driven non-profit web platform committed to unlocking Nepal's economic potential through women entrepreneurship and local business empowerment. This project provides a modern, responsive UI for the Impact Initiative Nepal organization, featuring program management, participant engagement, and an admin dashboard.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Admin Panel](#admin-panel)

---

## Overview
Impact Initiative Nepal (IIN) is a non-profit organization dedicated to transforming Nepal's economic landscape by empowering women entrepreneurs and local business communities. The platform supports the Government of Nepal's vision of becoming a middle-income country by 2030 through targeted programs, training, and strategic partnerships.

## Features
- **Comprehensive Training Programs:**
  - Academy for Women Entrepreneurs (AWE) 12-week bootcamp
  - Digital Skills Bootcamp
  - Rural Entrepreneur Network
- **Impact Pillars:**
  - Accelerating Job Creation
  - Unlocking Women's Economic Potential
  - Empowering Local Economies
  - Creating Skilled Workforce & Entrepreneurial Ecosystem
  - Supporting Sustainable Development Goals (SDGs)
- **Success Metrics:**
  - 500+ women empowered since 2020
  - 85% business success rate
  - 150+ businesses launched
  - 25+ training programs conducted
- **Admin Dashboard:**
  - Manage programs, participants, events, testimonials, contact forms, and newsletter subscribers
  - Secure authentication for admin users
- **Modern UI/UX:**
  - Responsive, accessible, and professional design
  - Built with React, TypeScript, and Tailwind CSS

## Tech Stack
- **Frontend:** React 18, TypeScript
- **UI Library:** shadcn/ui, Radix UI, Tailwind CSS
- **State/Data:** React Query, React Context
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **Routing:** React Router DOM
- **Charts:** Recharts
- **Other:** Vite, ESLint, PostCSS, Lucide Icons

## Getting Started

### Prerequisites
- Node.js (v18+ recommended)
- npm or bun

### Installation
1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd nepal-impact-ui-kit
   ```
2. **Install dependencies:**
   ```bash
   npm install
   # or
   bun install
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory with the following:
     ```env
     VITE_SUPABASE_URL=your_supabase_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```
4. **Start the development server:**
   ```bash
   npm run dev
   # or
   bun run dev
   ```
   The app will be available at [http://localhost:8080](http://localhost:8080)

## Environment Variables
- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anon/public API key

## Available Scripts
- `npm run dev` — Start the development server
- `npm run build` — Build for production
- `npm run preview` — Preview the production build
- `npm run lint` — Run ESLint

## Admin Panel
- **Access:** `/admin/login`
- **Demo Credentials:**
  - Username: ``
  - Password: ``
- **Features:**
  - Dashboard with key stats
  - Manage participants, programs, events, testimonials, contact forms, and newsletter subscribers
  - Secure authentication and session management

## Folder Structure
- `src/components/` — UI components (including admin and home sections)
- `src/pages/` — Main pages (Home, About, Team, Contact, Admin, etc.)
- `src/lib/` — Supabase client and utilities
- `src/contexts/` — React context providers
- `src/assets/` — Images and static assets
- `public/` — Static files (favicon, robots.txt, etc.)

---

> Empowering communities, one entrepreneur at a time.
