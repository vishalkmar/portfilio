# Portfolio Website - Full Stack Application

## Overview

This is a modern full-stack portfolio website built with React frontend and Express backend. The application showcases a developer's work, skills, and services through an interactive, animated interface. It features a dark theme design with smooth animations, responsive layout, and professional presentation of projects and contact information.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **Styling**: Tailwind CSS with custom design system using CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible components
- **Animations**: Framer Motion for smooth page transitions and scroll animations
- **State Management**: TanStack React Query for server state management and caching
- **Form Handling**: React Hook Form with Zod validation for type-safe form processing

### Backend Architecture  
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for type safety across the full stack
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **API Design**: RESTful API structure with `/api` prefix for all endpoints
- **Development**: Vite integration for hot module replacement and fast development builds

### Database Design
- **ORM**: Drizzle with PostgreSQL dialect for type-safe database operations
- **Schema**: Centralized schema definition in `shared/schema.ts` for consistency
- **Migrations**: Drizzle Kit for database migrations and schema management
- **Current Tables**: Users table with basic authentication fields (id, username, password)

### Project Structure
- **Monorepo**: Organized with separate `client`, `server`, and `shared` directories
- **Client**: React application with component-based architecture
- **Server**: Express API with modular route handling
- **Shared**: Common types and schemas used by both client and server
- **Build System**: Vite for frontend, esbuild for backend production builds

### Development Tools
- **TypeScript**: Strict type checking across the entire application
- **ESModules**: Modern ES module syntax throughout
- **Path Aliases**: Configured for clean imports (`@/`, `@shared/`)
- **Hot Reload**: Development server with automatic reloading

## External Dependencies

### Database & ORM
- **Neon Database**: Serverless PostgreSQL database hosting (`@neondatabase/serverless`)
- **Drizzle ORM**: Type-safe database toolkit for PostgreSQL operations
- **Drizzle Kit**: Database migration and introspection tools

### UI & Styling
- **Radix UI**: Unstyled, accessible component primitives for complex UI elements
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens
- **Lucide React**: Consistent icon library for UI elements
- **Framer Motion**: Animation library for smooth transitions and interactions

### Development & Build
- **Vite**: Fast build tool and development server for frontend
- **esbuild**: Fast JavaScript bundler for backend production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer
- **tsx**: TypeScript execution for development server

### Additional Libraries
- **TanStack React Query**: Server state management and caching
- **React Hook Form**: Form handling with performance optimization
- **Zod**: Runtime type validation and schema definition
- **date-fns**: Date manipulation utilities
- **clsx & tailwind-merge**: Conditional CSS class handling
- **Wouter**: Minimalist routing library for React