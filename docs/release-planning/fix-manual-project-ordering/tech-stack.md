# Project Ordering Fix Tech Stack

This document outlines the existing technology stack for the Personal CRM application and any additions needed for the project ordering fix release.

## Key Architectural Patterns

### Context-Based State Management

The application uses React Context pattern extensively for state management, with dedicated contexts for different data domains (Projects, Accounts, People, etc.). The ProjectsContext centralizes project data fetching, caching, and mutations using SWR for optimistic updates and real-time synchronization.

### Pages Router Architecture

Built on Next.js 14 with Pages Router, the application follows file-based routing conventions with dynamic routes for entities like projects and accounts. The architecture supports server-side rendering and static generation where appropriate.

### Component Composition

The UI is built using a component composition pattern with reusable accordion items, form components, and specialized business logic components. The DefaultAccordionItem serves as a foundational component extended by domain-specific accordion items.

### AWS Amplify Gen2 Backend

The backend leverages AWS Amplify Gen2 with TypeScript-first development, providing type-safe GraphQL APIs, authentication via Amazon Cognito, and real-time data synchronization through AWS AppSync subscriptions.

## Technology Selection Principles

The technology choices prioritize:

1. **Type Safety**: Full TypeScript implementation from frontend to backend schemas
2. **Developer Experience**: Hot reloading, type checking, and integrated development workflows
3. **AWS Ecosystem**: Consistent infrastructure and data privacy through AWS services
4. **Real-time Capabilities**: Optimistic updates and real-time synchronization for collaborative workflows
5. **Maintainability**: Clear separation of concerns and reusable component patterns

## Frontend

### Framework: Next.js 14 (Pages Router)

Next.js 14 with Pages Router provides the foundation for the application, offering file-based routing, server-side rendering capabilities, and excellent developer experience. The Pages Router architecture aligns with the team's existing codebase structure and provides clear navigation patterns for the CRM functionality.

### UI Library: Radix UI + Tailwind CSS

Radix UI primitives provide accessible, unstyled components for complex UI patterns like accordions, dialogs, and form controls. Tailwind CSS handles styling with a utility-first approach, enabling rapid UI development and consistent design system implementation. The combination supports the application's accordion-heavy interface and responsive design requirements.

### State Management: React Context + SWR

React Context manages global application state for different data domains, while SWR handles data fetching, caching, and synchronization. This combination provides optimistic updates, automatic revalidation, and offline resilience - crucial for the project ordering functionality where immediate UI feedback is essential.

### Rich Text Editing: TipTap

TipTap editor with ProseMirror foundation powers the note-taking and content creation features throughout the application. Its extensible architecture supports custom functionality and integrates well with the React ecosystem.

## Backend

### AWS Amplify Gen2

AWS Amplify Gen2 serves as the backend-as-a-service platform, providing type-safe GraphQL APIs generated from TypeScript schema definitions. The Gen2 architecture supports the application's complex relational data model and real-time subscription requirements.

### Database: Amazon DynamoDB

DynamoDB handles all persistent data storage with single-table design patterns optimized for the application's access patterns. The NoSQL approach supports the flexible data requirements while maintaining high performance for project ordering operations.

### Authentication: Amazon Cognito

Amazon Cognito provides user authentication and authorization, integrating seamlessly with the Amplify backend to secure API access and enable user-specific data isolation.

### Real-time Updates: AWS AppSync

AWS AppSync enables real-time data synchronization through GraphQL subscriptions, ensuring project order changes are immediately reflected across all connected clients.

## Development and Operations

### Language: TypeScript

Full TypeScript implementation ensures type safety across the entire application stack, from frontend components to backend schema definitions. This reduces runtime errors and improves developer productivity, especially important for complex data transformations like project ordering calculations.

### Package Management: npm

npm manages dependencies and scripts, providing reliable package resolution and security auditing. The lock file ensures consistent builds across development and production environments.

### Code Quality: ESLint + Prettier

ESLint enforces code quality standards with TypeScript-specific rules, while Prettier handles code formatting. This combination ensures consistent code style and catches potential issues early in the development process.

### Version Control: Git with Husky

Git version control with Husky pre-commit hooks ensures code quality standards are maintained. Commitlint enforces conventional commit messages for clear release notes and changelog generation.

### Deployment: AWS Amplify Hosting

AWS Amplify Hosting provides seamless deployment with automatic builds triggered by Git commits. The platform handles both frontend static site hosting and backend infrastructure deployment through a unified development experience.

## Release-Specific Considerations

For the project ordering fix release, the existing tech stack requires no additional technologies or architectural changes. The solution leverages:

- **Existing React Context**: Enhanced with optional parameters for filtered ordering
- **Current SWR Implementation**: Supports optimistic updates for immediate UI feedback
- **Existing Component Architecture**: Extended with new props for order control visibility
- **AWS Amplify Backend**: No schema changes required, only business logic modifications

This approach ensures backward compatibility while fixing the core ordering functionality without introducing new technical dependencies or architectural complexity.
