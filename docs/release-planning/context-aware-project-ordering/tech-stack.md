# Context-Aware Project Ordering Tech Stack

## Key Architectural Patterns

### Client-Side State Management with Optimistic Updates

The application leverages SWR (Stale-While-Revalidate) for client-side state management, providing automatic caching, revalidation, and optimistic updates. This pattern ensures immediate UI feedback for project ordering operations while maintaining data consistency with the backend. The optimistic update approach allows users to see project movements instantly, with automatic rollback in case of API failures.

### Context-Aware Data Filtering

The existing filtering architecture uses React Context providers to manage project filtering state across different views. This pattern enables consistent filter behavior across main project lists, planning views, and activity contexts while maintaining separation of concerns between filtering logic and UI components.

### Manual Ordering with Fractional Values

The current ordering system uses fractional order values (e.g., 1.5 between projects 1 and 2) to enable efficient project repositioning without requiring updates to all subsequent projects. This approach minimizes database writes and provides smooth user interactions for manual sorting operations.

### Component Composition with Props Interface

The UI architecture follows React's composition pattern, allowing components like ProjectAccordionItem to be configured for different contexts through props interfaces. This enables code reuse while providing context-specific behavior and appearance.

## Technology Selection Principles

The technology choices for this release build upon established patterns in the codebase:

1. **Backward Compatibility**: All changes maintain compatibility with existing interfaces and data structures
2. **Performance Optimization**: Minimize database operations and maximize client-side efficiency
3. **User Experience Focus**: Prioritize immediate visual feedback and intuitive interactions
4. **Code Reusability**: Extend existing components rather than creating new implementations
5. **Type Safety**: Leverage TypeScript for robust development and maintenance

## Frontend

### Framework: Next.js 14 (Pages Router)

Next.js 14 with Pages Router continues as the frontend framework, providing the established file-based routing system and API integration patterns. The Pages Router architecture supports the existing project structure and maintains compatibility with current routing implementations across project management views.

### State Management: SWR + React Context

SWR remains the primary data fetching and caching solution, providing optimistic updates essential for smooth project ordering interactions. React Context continues managing application state, including project filtering contexts and user preferences. This combination ensures consistent state management across filtered and unfiltered project views.

### UI Components: Radix UI + Custom Components

The existing Radix UI component library provides accessible, customizable primitives for accordion items, buttons, and other interface elements. Custom components like ProjectAccordionItem are extended with new props interfaces to support configurable sorting behavior without breaking existing usage patterns.

### Styling: TailwindCSS

TailwindCSS continues providing utility-first styling, enabling rapid development of conditional UI states (showing/hiding sorting controls) and maintaining visual consistency across different project management contexts.

### Type Safety: TypeScript

TypeScript ensures type safety for new component props, API interfaces, and data transformation functions, reducing runtime errors and improving development experience for context-aware ordering logic.

## Backend

### Cloud Platform: AWS Amplify Gen2

AWS Amplify Gen2 provides the existing backend infrastructure, including GraphQL API, DynamoDB storage, and Cognito authentication. No backend changes are required for this release, as the enhanced ordering logic operates entirely within the existing data schema and API patterns.

### Database: Amazon DynamoDB

DynamoDB continues storing project data with the existing order field structure. The fractional ordering system works within current database constraints, requiring no schema modifications or migrations for the enhanced ordering logic.

### API Layer: AWS AppSync GraphQL

The existing GraphQL API through AWS AppSync handles project updates, maintaining the current mutation patterns for project order modifications. The context-aware ordering logic operates through existing updateProject mutations.

### Authentication: Amazon Cognito

Amazon Cognito continues providing user authentication and context separation (Family/Work/Hobby), with the enhanced ordering logic respecting existing user context boundaries.

## Development and Operations

### Data Fetching: SWR with Context Providers

SWR's built-in optimistic update capabilities support the enhanced ordering experience, providing immediate UI feedback while ensuring data consistency. Context providers manage filtered state across different views, enabling consistent ordering behavior regardless of current filter context.

### Component Testing: TypeScript + React Patterns

The existing TypeScript configuration ensures type safety for new component props and interfaces. React's component patterns support extending ProjectAccordionItem with backward-compatible props interfaces.

### Build System: Next.js Build Pipeline

The established Next.js build system handles the enhanced ordering logic without requiring additional build configuration or optimization steps.

### Deployment: AWS Amplify CI/CD

The existing Amplify deployment pipeline continues handling frontend builds and deployments, with no changes required for the enhanced ordering functionality.

## Implementation Approach

### Enhanced Order Calculation Logic

The core enhancement involves sophisticated order calculation algorithms that:

- Analyze current filter contexts to identify visible projects
- Calculate appropriate order values within filtered boundaries
- Maintain global ordering consistency across all views
- Preserve existing normalization and migration systems

### Context Detection System

A lightweight context detection system identifies:

- Current page or component context
- Active filter parameters and states
- Expected user behavior patterns
- Appropriate ordering calculation strategies

### Backward-Compatible Component Extensions

Component enhancements follow established patterns:

- Optional props with sensible defaults
- No breaking changes to existing usage
- Consistent API patterns across similar components
- Maintained TypeScript type safety

This tech stack approach ensures the context-aware ordering enhancements integrate seamlessly with existing architecture while providing the enhanced user experience outlined in the design document.
