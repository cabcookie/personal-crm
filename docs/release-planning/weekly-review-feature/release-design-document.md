# Release Design Document: Weekly Review Feature

## Overview

The Weekly Review feature enhances the Personal CRM application by providing an AI-powered business intelligence capability that analyzes project activities and generates structured reports in Amazon's executive review format. This feature focuses on open projects and recently closed projects (within 2 weeks), analyzing their notes from the past 6 weeks to produce a comprehensive 2x2 matrix report covering Customer Highlights, Customer Lowlights, Market Observations, and GenAI Opportunities. The feature uses a phased AI approach to ensure high-quality categorization and content generation.

## Key Feature Additions

### 1. Dedicated Weekly Business Review Page

- **New Navigation Page**: Creation of a dedicated page (`/pages/weekly-business-review/index.tsx`) accessible from the main navigation menu
- **Historical Review List**: Display of previously generated weekly business reviews with dates and status. The visual compares to the list of meetings (`/pages/meetings/index.tsx`) with one accordion for each review; the accordions title is like `Week of June 30th, 2025`. When you open an accordion it shows an accordion for each category similar to the topics list in a meeting record
- **Create New Review**: Prominent button to start generation of a new weekly business review (see meeting list as an example as well)
- **Progress Visualization**: Real-time display of which project is currently being analyzed during generation

### 2. Three-Phase AI Analysis System

- **Phase 1 - Project Categorization**: AI first determines if each project's notes fall into one of four categories:
  - Customer Highlights: Positive developments and wins
  - Customer Lowlights: Challenges and setbacks
  - Market Observations: Industry trends and competitive insights
  - GenAI Opportunities: AI-related business opportunities
  - None of the above (filtered out)
- **Phase 2 - Content Generation**: For categorized projects, AI generates high-quality Amazon-style statements (use `/docs/release-planning/weekly-review-feature/example-report.md` as an example)
- **Phase 3 - Duplicate Detection**: AI checks if the same project was mentioned in the same category within the past 4 weeks and validates if current mention represents a significant change. If not significant, the project is filtered out to avoid repetitive reporting
- **Quality Control**: Three-phase approach ensures high-quality, non-redundant content

### 3. Smart Project Selection Logic

- **Open Projects**: All currently active projects included in analysis
- **Recently Closed Projects**: Projects closed within the last 2 weeks included
- **6-Week Note Window**: For each selected project, analyze notes from the past 6 weeks
- **Focused Analysis**: Project-centric approach rather than activity-wide analysis

### 4. Progressive Review Interface

- **Progress Indicators**: Live display of current project being processed with clear "work in progress" status
- **Read-Only Generation**: AI-generated content displays as non-editable during the generation process
- **Accordion-Based Editing**: When generation is complete, each project entry is displayed in an accordion with integrated note editor
- **Deletion Controls**: Users can remove entries they deem not worth mentioning in the final report
- **Category Organization**: Clear separation of entries by the four 2x2 categories with visual indicators

### 5. Persistent Storage Schema

- **New Database Schema**: Dedicated storage for 2x2 review entries with:
  - Date of review generation
  - Related project ID
  - Category (highlight/lowlight/observation/opportunity)
  - Editable content field
- **Historical Tracking**: Ability to view and compare previous weekly reviews
- **Project Linkage**: Direct connections to source projects for context

## Technical Implementation Approach

### Frontend Components

- Progress tracking UI during analysis
- Draft preview components with real-time updates
- Editable content interface using existing note editor
- Category-based organization and display

### Backend Services

- Project query logic (open + recently closed)
- Note aggregation with 6-week window
- Two-phase AI processing pipeline
- New GraphQL schema for 2x2 storage

### AI Integration

- Categorization prompt for initial project analysis
- Content generation prompt for Amazon-style statements
- Quality control through phased approach
- Error handling for uncategorizable projects

## User Experience Flow

1. User navigates to Weekly Business Review page from navigation menu
2. User sees list of previous reviews and clicks "Create New Weekly Review"
3. System identifies relevant projects (open + recently closed) using existing ContextProjects data
4. For each project, system displays "Analyzing [Project Name]..." with progress indicator
5. **Phase 1**: AI categorizes project notes (6-week window) - content shows as "work in progress"
6. **Phase 2**: If categorized, AI generates Amazon-style statement - still read-only
7. **Phase 3**: AI checks for duplicates against past 4 weeks of reviews and validates significance
8. When all phases complete, entries appear in editable accordions organized by category
9. User can edit content using familiar note editor or delete unwanted entries
10. Final 2x2 matrix is saved to database with full project linkages and historical context

## Business Value

- **Project-Focused Intelligence**: Deeper insights into specific business initiatives
- **Trend Evolution**: 6-week window allows for meaningful pattern recognition
- **Executive Readiness**: High-quality statements ready for leadership consumption
- **Historical Context**: Stored reviews enable trend analysis over time
- **Actionable Insights**: Project-specific recommendations with clear attribution
