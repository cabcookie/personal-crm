# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Development
- `npm run dev` - Start Next.js development server
- `npm run build` - Build production application
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with automatic fixes

### Amplify Operations
- `npx ampx sandbox --profile impulso` - Start Amplify sandbox environment
- `npm run create-post-confirmation-code` - Generate GraphQL client code for auth post-confirmation

### Data Import Scripts
- `npm run import-data-dev` - Import data to dev environment
- `npm run import-data-staging` - Import data to staging environment  
- `npm run import-data-prod` - Import data to production environment

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 14 with Pages Router, React 18, TypeScript
- **UI Components**: Radix UI primitives with Tailwind CSS
- **State Management**: React Context + SWR for data fetching/caching
- **Rich Text Editor**: TipTap with ProseMirror
- **Backend**: AWS Amplify Gen2 with TypeScript-first GraphQL APIs
- **Database**: Amazon DynamoDB with single-table design
- **Authentication**: Amazon Cognito
- **Real-time**: AWS AppSync GraphQL subscriptions

### Key Directories

#### `/amplify/`  
AWS Amplify Gen2 backend configuration:
- `backend.ts` - Main backend configuration with DynamoDB table protection logic
- `auth/` - Cognito authentication setup with post-confirmation handler
- `data/` - GraphQL schema definitions split by domain (accounts, projects, people, etc.)
- `storage/` - S3 storage configuration

#### `/pages/`
Next.js Pages Router structure:
- Dynamic routes for entities: `[id].tsx` patterns
- Main sections: accounts, projects, people, meetings, bible, chat
- API routes in `/api/` for server-side logic

#### `/components/`
Domain-organized React components:
- Business logic components grouped by domain (accounts/, projects/, people/, etc.)
- `/ui/` - Reusable UI primitives based on Radix UI
- `/ui-elements/` - Complex composed components (editors, forms, selectors)

#### `/api/`
Custom React hooks and API helpers:
- Follows `use[Entity]` naming convention
- Context providers for global state management
- Helper functions for data transformations

#### `/helpers/`
Utility functions organized by domain matching component structure

### State Management Pattern

The application uses React Context extensively for domain-specific state:
- `ContextProjects.tsx` and `ContextAccounts.tsx` provide global state
- SWR handles data fetching, caching, and optimistic updates
- Real-time synchronization through AWS AppSync subscriptions

### Component Architecture

- **Accordion-based UI**: Heavy use of `DefaultAccordionItem` as base component
- **Form patterns**: React Hook Form with Zod validation
- **Rich text editing**: TipTap editors with custom extensions for mentions, tasks, and S3 images
- **Responsive design**: Mobile-first with Tailwind CSS

### Data Schema Organization

GraphQL schemas in `/amplify/data/` are split by domain:
- `account-schema.ts` - Company/organization data
- `person-schema.ts` - Individual contacts and relationships  
- `project-schema.ts` - Projects and tasks
- `activity-schema.ts` - Meetings, notes, interactions
- `planning-schema.ts` - Daily/weekly planning features
- `bible-schema.ts` - Bible study features
- `ai-schema.ts` - AI conversation features

### Development Environment Setup

1. AWS CLI configured with appropriate profiles (`impulso` for sandbox)
2. Environment configuration in `scripts/env.json` for data import scripts
3. Amplify sandbox provides isolated development environment
4. Hot reloading for both frontend and backend schema changes

### Testing and Quality

- ESLint configuration with TypeScript rules
- Prettier for code formatting
- Husky pre-commit hooks with commitlint
- Conventional commit messages for automated release notes