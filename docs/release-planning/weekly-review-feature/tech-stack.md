# Weekly Review Feature Tech Stack

## Key Architectural Patterns

### Phased AI Processing
The Weekly Review feature implements a two-phase AI processing pattern where projects are first categorized and then content is generated. This approach ensures higher quality outputs by separating the decision logic (categorization) from the creative logic (content generation), allowing each AI call to be optimized for its specific purpose.

### Progressive Data Loading
The feature uses a progressive loading pattern where project data is fetched incrementally during the review generation process. This provides real-time feedback to users about processing status while managing memory usage and API call efficiency across potentially large datasets.

### Temporal Data Queries
The system implements intelligent temporal querying patterns that distinguish between project status (2-week window for closed projects) and note analysis (6-week window for content). This dual-timeframe approach balances relevance with depth of analysis.

### Schema Extension Pattern
The feature extends the existing GraphQL schema with new data models for storing generated reviews while maintaining relationships to existing project entities. This preserves data integrity and enables cross-referencing between reviews and source projects.

## Technology Selection Principles

The technology choices for the Weekly Review feature prioritize:

1. **AWS-Native Integration**: Leverage existing AWS Amplify Gen2 infrastructure and AI services
2. **Minimal New Dependencies**: Build on the established React/Next.js foundation without introducing complexity
3. **User Experience Continuity**: Maintain familiar UI patterns and interactions from the existing application
4. **Data Consistency**: Ensure new features integrate seamlessly with existing data models and workflows
5. **Performance Optimization**: Design for efficient processing of potentially large datasets across multiple projects

## Frontend

### Framework: Next.js 14 (Pages Router)
The Weekly Review feature builds on the existing Next.js 14 Pages Router architecture, ensuring consistency with the current application structure. The feature integrates directly into the existing chat interface without requiring new routing patterns, maintaining the familiar user experience while adding powerful new capabilities.

### UI Components: Existing Component System + Radix UI
The feature leverages the established Radix UI + Tailwind CSS component system, particularly the existing note editor components for content editing functionality. Progress indicators and loading states utilize existing UI patterns, ensuring visual consistency across the application.

### State Management: React Context + SWR
The feature extends the existing React Context pattern with new context providers for review generation state management. SWR handles caching of generated reviews and provides optimistic updates during the multi-phase generation process, maintaining the application's responsive user experience.

### Date Handling: date-fns
date-fns is selected for temporal calculations (6-week note windows, 2-week project closure detection) due to its lightweight nature, tree-shaking support, and functional programming approach that aligns well with React patterns. It provides reliable date arithmetic without the overhead of larger libraries like moment.js.

## Backend

### AI Services: AWS Amplify Gen2 + Claude Sonnet
The feature extends the existing AI schema with new generation functions for both categorization and content generation phases. Claude Sonnet 4 provides the advanced reasoning capabilities needed for business intelligence analysis while maintaining consistency with the existing AI integration patterns.

### Database: Amazon DynamoDB (Schema Extension)
New DynamoDB table structures are added to store generated reviews with relationships to existing project entities. The schema design supports efficient querying by date ranges and categories while maintaining the single-table design patterns used throughout the application.

### GraphQL API: AWS AppSync (Extended Schema)
The existing GraphQL schema is extended with new mutations for review generation and queries for retrieving historical reviews. The API design follows established patterns for authorization and data access while adding the new review-specific operations.

### Data Processing: Lambda Functions (Implicit via Amplify)
AWS Lambda functions (managed by Amplify) handle the multi-phase AI processing workflow, including project selection logic, note aggregation, and coordination between categorization and content generation phases.

## Development and Operations

### Development Environment: Existing Amplify Sandbox
The feature development leverages the existing Amplify sandbox environment, ensuring consistent development patterns and avoiding the need for additional infrastructure setup. The sandbox supports iterative development of both AI prompts and UI components.

### Code Quality: ESLint + Prettier (Existing Configuration)
The feature follows the established code quality standards and formatting rules, ensuring consistency with the existing codebase. TypeScript types are extended to support the new data models and API contracts.

### Testing Strategy: Integration with Existing Patterns
Testing follows the established patterns using the existing test infrastructure. Focus areas include AI prompt reliability, data query performance, and UI state management during the multi-phase generation process.