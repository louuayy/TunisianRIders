# Moto Tunisia - Motorcycle Magazine Platform

## Overview

Moto Tunisia is a full-stack web application serving as Tunisia's premier motorcycle magazine platform. The application features a comprehensive motorcycle catalog with 19 motorcycle models, article management system, and admin interface with authentication for content management. Built with modern web technologies, it provides a responsive and engaging experience for motorcycle enthusiasts.

## Recent Changes (January 2025)

✓ Added session-based authentication for admin dashboard
✓ Expanded motorcycle catalog to 19 models from Honda, BMW, KTM, Yamaha, Mash, Orcal, and Rieju
✓ Improved motorcycle images with better quality Unsplash photos
✓ Enhanced filtering system with category filters (sport, naked, adventure, classic)
✓ Implemented secure admin login (credentials: admin/admin123)
✓ Added logout functionality for admin users
✓ Migrated from in-memory storage to PostgreSQL database
✓ Implemented database seeding with all motorcycle and article data
✓ Added proper "Learn More" functionality with detailed modals

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with custom design system
- **State Management**: TanStack Query for server state management
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API architecture
- **Storage**: In-memory storage with interface for future database integration
- **Session Management**: Connect-pg-simple for PostgreSQL session store

### Data Storage Solutions
- **Database ORM**: Drizzle ORM configured for PostgreSQL
- **Schema**: Shared schema definitions using Drizzle and Zod validation
- **Current Implementation**: Memory-based storage with database interface
- **Future Database**: PostgreSQL with Neon Database serverless integration

## Key Components

### Data Models
- **Motorcycles**: Complete motorcycle catalog with specifications, images, and categorization
- **Articles**: Content management for motorcycle-related articles with categories and publishing status
- **Schema Validation**: Zod schemas for type-safe data validation

### UI Components
- **Navigation**: Responsive navigation with search functionality and theme switching
- **Cards**: Reusable card components for motorcycles and articles
- **Forms**: Admin forms for content creation and management
- **Theme System**: Dark/light mode with custom CSS variables

### Pages
- **Home**: Landing page with hero section and featured content
- **Motorcycles**: Filterable motorcycle catalog with brand and type filters
- **Articles**: Article browsing with category-based filtering
- **Admin**: Content management interface for motorcycles and articles

## Data Flow

### Client-Server Communication
1. React components use TanStack Query for data fetching
2. API requests go through centralized query client with error handling
3. Express routes handle CRUD operations for motorcycles and articles
4. Storage layer abstracts data access with interface pattern

### State Management
- Server state managed by TanStack Query with caching
- Local UI state handled by React hooks
- Theme state persisted in localStorage
- Form state managed by React Hook Form

## External Dependencies

### UI and Styling
- Radix UI for accessible component primitives
- Tailwind CSS for utility-first styling
- Lucide React for consistent iconography
- Class Variance Authority for component variants

### Development Tools
- TypeScript for type safety
- ESBuild for production bundling
- PostCSS with Autoprefixer for CSS processing
- Vite plugins for development experience

### Backend Libraries
- Drizzle ORM for database operations
- Zod for schema validation
- Date-fns for date manipulation
- Nanoid for unique ID generation

## Deployment Strategy

### Development
- Vite dev server for frontend with HMR
- tsx for TypeScript execution in development
- Concurrent frontend and backend serving

### Production Build
1. Vite builds optimized React application
2. ESBuild bundles Node.js server with external packages
3. Static assets served from dist/public
4. Single Node.js process serves both API and static files

### Environment Configuration
- Environment variables for database connection
- Separate development and production configurations
- Database migrations handled by Drizzle Kit

### Key Architectural Decisions

1. **Monorepo Structure**: Single repository with shared types and schemas between frontend and backend
2. **Type Safety**: End-to-end TypeScript with shared schema validation
3. **Modern Tooling**: Vite for fast development and ESBuild for efficient production builds
4. **Component Architecture**: Reusable UI components with consistent design system
5. **Database Abstraction**: Storage interface allows switching from memory to PostgreSQL without code changes
6. **API Design**: RESTful endpoints with proper error handling and logging
7. **Theme System**: CSS custom properties enable dynamic theming with persistence