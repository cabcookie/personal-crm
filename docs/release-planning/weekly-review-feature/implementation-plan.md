# Weekly Review Feature Implementation Plan

## Step 1: Extend Database Schema for Review Storage

Create a new schema for storing weekly review entries without initial delete protection (to be added later due to Amplify challenges).

**Tasks:**

- Create `amplify/data/weekly-review-schema.ts` with models for:
  - `WeeklyReview` model with fields: date, owner, status, createdAt
  - `WeeklyReviewEntry` model with fields: reviewId, projectId, category, content, createdAt, updatedAt
  - Include proper relationships and secondary indexes for efficient querying by date and project
- Update `amplify/data/resource.ts` to include the new schema
- Note: Delete protection will be added in a later step due to Amplify configuration challenges

## Step 2: Implement Three-Phase AI Generation Functions

Extend the existing AI schema with new generation functions for the comprehensive three-phase review process.

**Tasks:**

- Add `projectCategorization` generation function to `amplify/data/ai-schema.ts` for Phase 1 (determining category)
- Add `reviewContentGeneration` generation function for Phase 2 (creating Amazon-style content)
- Add `duplicateDetection` generation function for Phase 3 (checking 4-week history and significance validation)
- Configure all functions with appropriate AI models, system prompts, input/output schemas, and authorization
- Design prompts that analyze 6-week project note windows and historical review context

## Step 3: Create Data Access Layer and Leverage Existing Project Context

Implement custom hooks that leverage the existing ContextProjects.tsx infrastructure and add specific functionality for weekly reviews.

**Tasks:**

- Create `api/useWeeklyReview.ts` hook with functions for:
  - Leveraging existing `useProjectsContext` for open and recently closed projects (using `doneOn` field with 2-week filter)
  - Retrieving project activity notes from the past 6 weeks via existing activity relationships
  - Executing the three-phase AI processing pipeline (categorization → content generation → duplicate detection)
  - Saving and retrieving weekly review entries with historical context
- Create `helpers/weeklyReviewHelpers.ts` with utilities for:
  - Date calculations (2-week and 6-week windows using date-fns)
  - Project filtering logic that integrates with existing Project type
  - Activity note aggregation from existing activity data structures
  - Review data transformation and historical comparison logic

## Step 4: Create Navigation Integration and Weekly Business Review Page

Build the dedicated page structure and navigation integration for managing weekly business reviews.

**Tasks:**

- Update `components/navigation-menu/NavigationMenu.tsx` to include "Weekly Business Review" navigation option
- Create `pages/weekly-business-review/index.tsx` with:
  - List of historical weekly reviews with dates and status indicators
  - "Create New Weekly Review" button with prominent styling
  - Integration with existing layout patterns and navigation structure
- Create `components/weekly-review/ReviewHistory.tsx` for displaying and managing past reviews
- Ensure consistent styling and user experience with existing application patterns

## Step 5: Build Progressive Review Generation UI Components

Create the user interface components for the three-phase generation process with clear work-in-progress indicators and accordion-based editing.

**Tasks:**

- Create `components/weekly-review/ReviewGenerator.tsx` with:
  - Progress tracking display showing current project and phase being processed
  - Read-only preview during AI generation with clear "work in progress" indicators
  - Phase indicators (categorization → content generation → duplicate detection)
- Create `components/weekly-review/ReviewAccordion.tsx` with:
  - Accordion layout for each generated entry when processing is complete
  - Integration with existing note editor components for content editing
  - Delete functionality for unwanted entries
  - Category-based visual organization and badges
- Create `components/weekly-review/CategorySection.tsx` for organizing entries by the four 2x2 categories

## Step 6: Implement Three-Phase Processing Workflow

Implement the complete workflow that orchestrates the three-phase AI processing with proper state management and user feedback.

**Tasks:**

- Implement the sequential three-phase processing logic in the review generator:
  - Phase 1: Project categorization with progress indicators
  - Phase 2: Content generation for categorized projects
  - Phase 3: Duplicate detection and significance validation against 4-week history
- Add comprehensive error handling for failed AI calls, network issues, and processing interruptions
- Implement state management that clearly distinguishes between "work in progress" and "ready for editing" states
- Add real-time UI updates using SWR patterns with proper loading states for each phase
- Ensure graceful degradation and recovery options for long-running processes

## Step 7: Create Review Management and Historical Analysis Interface

Build interfaces for viewing, editing, and analyzing historical weekly reviews with trend analysis capabilities.

**Tasks:**

- Implement review editing functionality that maintains data integrity with project linkages
- Create comparison views for analyzing trends and patterns across multiple historical reviews
- Add search and filtering capabilities for large numbers of historical reviews
- Implement proper authorization and data access controls ensuring user-specific review access
- Create export functionality for sharing final 2x2 matrices in standard business formats
- Add duplicate detection visualization showing why certain projects were filtered out
