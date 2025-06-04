# Manual Project Ordering Tech Stack

## Key Architectural Patterns

**Full-Stack TypeScript Architecture**: The entire application maintains type safety from frontend components through to backend data models, ensuring consistency and reducing runtime errors across the stack.

**Component-Driven UI Architecture**: The frontend follows a modular component architecture with Radix UI primitives and custom components, promoting reusability and consistent user experience across the application.

**Real-time Data Synchronization**: AWS Amplify provides real-time GraphQL subscriptions and optimistic updates through SWR, ensuring users see immediate feedback while maintaining data consistency.

**Context-Aware Data Organization**: The application organizes all data (projects, activities, contacts) by context (family, work, hobby), providing logical separation and focused user experiences.

## Technology Selection Principles

**AWS-Native Integration**: Preference for AWS services and Amplify Gen2 to maintain seamless integration, reduce vendor complexity, and leverage managed services for reliability and scalability.

**Type Safety First**: TypeScript throughout the stack with generated types from GraphQL schemas ensures compile-time error detection and improved developer experience.

**Performance and User Experience**: Selection of technologies that support real-time updates, optimistic UI patterns, and responsive design for both desktop and mobile experiences.

**Developer Productivity**: Tools and frameworks chosen to maximize development velocity while maintaining code quality through automated linting, formatting, and type checking.

## Frontend

**Next.js 14 (Pages Router)**: Provides server-side rendering capabilities, file-based routing, and excellent TypeScript integration. The Pages Router architecture aligns with the existing codebase structure and provides clear separation of concerns for different application sections.

**React 18**: Modern React features including hooks, concurrent rendering, and optimal component patterns support the interactive nature of the CRM application with complex state management requirements.

**TypeScript**: Ensures type safety across all frontend code, with generated types from GraphQL schemas providing end-to-end type safety from database to UI components.

**TailwindCSS + Radix UI**: TailwindCSS provides utility-first styling for rapid development and consistent design, while Radix UI delivers accessible, unstyled primitives that can be customized to match the application's design system.

**SWR**: Provides data fetching with caching, revalidation, and optimistic updates. Essential for the project ordering feature where immediate UI feedback is required while background synchronization occurs.

**Tiptap**: Rich text editor for notes and project descriptions, providing a modern editing experience with structured content support.

**React Hook Form + Zod**: Form handling with comprehensive validation, supporting the complex form requirements throughout the CRM application.

## Backend

**AWS Amplify Gen2**: Modern full-stack development platform providing type-safe backend resources, automatic GraphQL API generation, and seamless frontend integration. Perfect for rapid development of the manual ordering features.

**Amazon DynamoDB**: NoSQL database providing fast, predictable performance for the project data and ordering information. The flexible schema supports the context-aware data organization pattern.

**AWS Lambda**: Serverless compute for custom business logic, including the order normalization system and data processing functions.

**Amazon Cognito**: Managed authentication service providing secure user management, supporting the multi-context user experience.

**GraphQL API (AWS AppSync)**: Auto-generated from schema definitions, providing type-safe API operations with real-time subscriptions for immediate UI updates.

**Amazon S3**: Object storage for file attachments and document management within projects and activities.

## Development and Operations

**AWS CDK**: Infrastructure as code for reliable, reproducible deployments. The existing backend configuration shows sophisticated DynamoDB table management with environment-specific settings.

**ESLint + Prettier**: Code quality and formatting automation ensuring consistent code style across the development team and reducing code review overhead.

**Husky + Commitlint**: Git hooks and commit message standardization supporting the established release management process evident in the extensive version history.

**TypeScript Compiler**: Compile-time type checking preventing runtime errors and improving code reliability, especially important for the complex data transformations in the ordering system.

**AWS CLI with SSO**: Secure deployment and development workflow management, supporting multiple environments (dev, staging, production) as evident in the npm scripts.

**SWR**: Beyond frontend data fetching, SWR's caching and revalidation patterns support the deduplication requirements for the order normalization system.
