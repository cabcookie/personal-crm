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
- `npm run create-code` - Generate GraphQL client code (`npx ampx generate graphql-client-code --out amplify/graphql-code --profile impulso`)

### Data Import Scripts

- `npm run import-data-dev` - Import data to dev environment
- `npm run import-data-staging` - Import data to staging environment
- `npm run import-data-prod` - Import data to production environment

Environment configuration required in `scripts/env.json` with AWS credentials and table IDs.

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
- `custom/` - Custom AWS CDK resources (e.g., data-schema-migrations)
- `functions/` - Lambda functions for custom business logic
- `graphql-code/` - Generated GraphQL client code (do not edit manually)

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

- Follows `use[Entity]` naming convention (e.g., `useProjects`, `usePeople`)
- Context providers for global state management (e.g., `ContextProjects.tsx`, `ContextAccounts.tsx`)
- Helper functions for data transformations
- SWR cache keys follow pattern: `/api/[entity]/${context}` (e.g., `/api/projects/${context}`)

#### `/helpers/`

Utility functions organized by domain matching component structure

### State Management Patterns

#### Context + SWR Pattern

The application uses React Context with SWR for state management:

1. **Context Providers** (`/api/Context*.tsx`):
   - Provide global state for domain entities
   - Handle optimistic updates for smooth UI
   - Manage both regular and special lists (e.g., `projects` and `pinnedProjects`)

2. **Optimistic Updates**:
   - Always mutate with `false` flag first for immediate UI update
   - Then perform API call
   - On error, revert to original state
   - On success, revalidate with server data

3. **Multiple List Synchronization**:
   - When data appears in multiple lists (e.g., pinned/unpinned projects), update all relevant caches
   - Use `mutatePinnedProjects()` alongside `mutateProjects()` for consistency

### Component Patterns

#### Accordion-based UI

Most list views use `DefaultAccordionItem` as the base component with:

- `triggerTitle` - Main title content
- `triggerSubTitle` - Secondary information array
- `actionIcon` - Optional action buttons (e.g., pin/unpin)
- `onMoveUp/onMoveDown` - Reordering functionality
- `showPin` - Conditional feature flags

#### Pin/Unpin Feature Pattern

When implementing pin/unpin functionality:

1. Add `showPin` prop to accordion components
2. Use hover state to switch icons (Pin ↔ PinOff)
3. Stop event propagation on click
4. Update both source and target lists optimistically

#### Order Management

Projects and other entities use fractional ordering:

- Order values are floats for insertion between items
- Automatic normalization runs when gaps get too small
- Move operations calculate midpoint between adjacent items

### Data Schema Patterns

#### GraphQL Schema Organization

Schemas in `/amplify/data/` follow these patterns:

1. **Enum definitions** for state management (e.g., `ProjectPinned: a.enum(["PINNED", "NOTPINNED"])`)
2. **Protected tables** listed in `tablesWithDeleteProtection` arrays
3. **Relationship patterns**:
   - `belongsTo` for many-to-one
   - `hasMany` for one-to-many
   - Junction tables for many-to-many (e.g., `AccountProjects`)
4. **Authorization**: Owner-based with specific operation permissions

#### Selection Sets

When fetching data, define explicit selection sets for:

- Performance optimization
- Type safety
- Nested relationship loading

### Development Workflow

1. **Schema Changes**:
   - Modify schema files in `/amplify/data/`
   - Sandbox auto-deploys changes
   - Run `npm run create-code` to regenerate GraphQL client

2. **Adding New Features**:
   - Create context provider in `/api/` if needed
   - Add component in domain folder under `/components/`
   - Use existing patterns (accordion items, form components)
   - Implement optimistic updates for better UX

3. **Code Quality**:
   - Run `npm run lint` before committing
   - Follow conventional commit messages for automated releases
   - Husky pre-commit hooks enforce standards

### Testing

No test framework currently configured. Manual testing through:

- Amplify sandbox for backend changes
- Next.js dev server with hot reload for frontend
- Browser DevTools for debugging React and network

### Important Notes

- The project uses AWS profile `impulso` for sandbox operations
- DynamoDB tables have deletion protection on production-critical entities
- GraphQL subscriptions enable real-time updates across browser tabs
- TipTap editor supports mentions (@), tasks, and S3 image uploads
- The app supports multiple contexts (e.g., Work, Family) for data segregation
