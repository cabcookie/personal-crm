# Implementation Plan: Project Task Summaries

## Overview

This implementation plan provides step-by-step instructions for adding AI-generated task summaries to active projects on the weekly planning page. The feature will help users quickly understand which projects need attention by providing intelligent summaries of open tasks.

## Step 1: Extend Database Schema for Task Summaries

**Objective**: Add fields to store AI-generated task summaries and their timestamps in the Projects model.

**Implementation Details**:

- Modify `amplify/data/project-schema.ts` to add two new optional fields to the `Projects` model:
  - `tasksSummary: a.string()` - stores the AI-generated summary text
  - `tasksSummaryUpdatedAt: a.datetime()` - tracks when the summary was last generated
- Ensure both fields are optional to maintain backward compatibility with existing projects
- Deploy schema changes using `npx ampx sandbox` to update the database structure
- Verify the new fields appear in the generated GraphQL schema and TypeScript types

**Testing Guidance**: Create a test project and verify the new fields can be read/written through the GraphQL API without affecting existing functionality.

## Step 2: Create AI Generation Function for Task Summaries

**Objective**: Add a new AI generation function to create concise summaries of project tasks using Claude 3.5 Haiku.

**Implementation Details**:

- Extend `amplify/data/ai-schema.ts` with a new generation function called `generateTasksSummary`
- Configure the function to use the Claude 3.5 Haiku model (`inference-profile/us.anthropic.claude-3-5-haiku-20241022-v1`)
- Create a system prompt that instructs the AI to:
  - Analyze the provided list of open tasks
  - Generate a concise 2-3 sentence summary highlighting key themes and priorities
  - Focus on actionable insights that help with weekly planning decisions
  - Maintain a professional, helpful tone
- Set up the function to accept a `tasks` string argument containing the concatenated task texts
- Configure the function to return a custom type with a `summary` string field
- Apply appropriate authorization rules (`allow.authenticated()`) following existing patterns

**Testing Guidance**: Test the AI function directly through the GraphQL API with sample task data to ensure it generates appropriate summaries.

## Step 3: Enhance useProjectTodos Hook with Summary Logic

**Objective**: Extend the existing `useProjectTodos` hook to include task summary generation and caching logic.

**Implementation Details**:

- Add a new function `generateTasksSummary` to the `useProjectTodos` hook that:
  - Extracts text content from all open (non-done) project todos
  - Concatenates the task texts into a single string for AI processing
  - Calls the new AI generation function with the concatenated tasks
  - Returns the generated summary text
- Implement smart caching logic by adding a `shouldRegenerateSummary` function that:
  - Compares the project's `tasksSummaryUpdatedAt` timestamp with the `updatedAt` timestamps of all open todos
  - Returns `true` if any todo has been updated more recently than the summary
  - Returns `true` if no summary exists yet
  - Returns `false` if the existing summary is still current
- Add a `getOrGenerateTasksSummary` function that:
  - Checks if regeneration is needed using the caching logic
  - Returns the existing summary if it's current
  - Generates and stores a new summary if needed
  - Updates both `tasksSummary` and `tasksSummaryUpdatedAt` fields in the project
- Export the new summary-related functions from the hook for use in components

**Testing Guidance**: Test the caching logic by creating todos, generating summaries, updating todos, and verifying that summaries regenerate appropriately.

## Step 4: Create Task Summary Display Component

**Objective**: Build a reusable component to display AI-generated task summaries with appropriate loading and error states.

**Implementation Details**:

- Create `components/projects/ProjectTasksSummary.tsx` component that:
  - Accepts a `projectId` prop and uses the enhanced `useProjectTodos` hook
  - Displays the task summary in a visually distinct card or section
  - Shows loading state while generating summaries with appropriate spinner/skeleton
  - Handles error states gracefully with user-friendly error messages
  - Includes a subtle timestamp indicator showing when the summary was last updated
  - Uses existing Tailwind CSS classes for consistent styling with the design system
- Implement conditional rendering to only show the component when:
  - The project has open todos (no summary needed for projects without tasks)
  - The user has appropriate permissions to view project details
- Add accessibility features including proper ARIA labels and semantic HTML structure
- Include a manual refresh option (small button/icon) for users who want to force regeneration

**Testing Guidance**: Test the component with projects that have various states: no todos, few todos, many todos, and mixed done/open todos.

## Step 5: Integrate Task Summaries into Weekly Planning Workflow

**Objective**: Seamlessly integrate task summaries into the existing weekly planning page and project decision components.

**Implementation Details**:

- Modify `components/planning/project/MakeProjectDecision.tsx` to include the new `ProjectTasksSummary` component
- Position the summary component between the `ProjectAccordionItem` and `DecisionSection` components for optimal user flow
- Ensure the summary appears within the project's accordion item but remains visible when the accordion is collapsed
- Update the component's styling to maintain visual hierarchy and not interfere with existing decision-making UI elements
- Implement responsive design considerations to ensure summaries display well on mobile devices
- Add conditional rendering to only show summaries for projects that have open tasks
- Ensure the integration doesn't affect existing keyboard navigation or accessibility features
- Maintain the existing project ordering and filtering functionality without interference

**Testing Guidance**: Test the complete weekly planning workflow with the new summaries, ensuring all existing functionality remains intact while the new feature enhances the user experience.

## Step 6: Optimize Performance and Error Handling

**Objective**: Implement comprehensive error handling, loading states, and performance optimizations for the task summary feature.

**Implementation Details**:

- Add error boundaries around summary components to prevent crashes from affecting the entire planning page
- Implement retry logic for failed AI generation requests with exponential backoff
- Add comprehensive error logging for debugging AI generation issues
- Optimize the summary generation process by:
  - Implementing request deduplication to prevent multiple simultaneous generations for the same project
  - Adding request timeouts to prevent hanging requests
  - Caching AI responses at the component level using SWR patterns
- Create fallback UI states for when AI generation is temporarily unavailable
- Add user feedback mechanisms for summary quality (optional future enhancement hook)
- Implement proper cleanup of any pending requests when components unmount
- Add monitoring hooks for tracking AI generation success rates and performance metrics

**Testing Guidance**: Test error scenarios including network failures, AI service unavailability, and malformed responses to ensure graceful degradation.

## Step 7: Documentation and Deployment Preparation

**Objective**: Complete the implementation with proper documentation and prepare for production deployment.

**Implementation Details**:

- Update relevant TypeScript type definitions to include the new summary fields and functions
- Add JSDoc comments to all new functions and components for maintainability
- Create or update unit tests for the new summary generation logic and caching mechanisms
- Update the project's README or documentation to describe the new task summary feature
- Verify all new code follows the project's existing ESLint and Prettier configurations
- Test the complete feature in the sandbox environment with realistic data
- Prepare database migration scripts if needed for existing projects
- Document any new environment variables or configuration requirements
- Create a rollback plan in case issues arise after deployment
- Verify that the new AI generation function doesn't exceed AWS Lambda timeout limits
- Test the feature with various project sizes to ensure performance remains acceptable

**Testing Guidance**: Perform end-to-end testing of the complete weekly planning workflow with the new task summaries, including edge cases like very large projects or projects with special characters in task descriptions.
