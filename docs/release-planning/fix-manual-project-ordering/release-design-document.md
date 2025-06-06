# Release Design Document: Project Ordering Fix

## Overview

This release addresses a critical bug in the project ordering functionality where projects are not being properly ordered when filtered in specific views. The current implementation uses a centralized project ordering system through `api/ContextProjects.tsx`, but when projects are filtered by status (WIP, ON HOLD, DONE) in various views, the manual ordering does not work correctly. Projects appear to move to incorrect positions when reordered, causing user confusion and workflow disruption.

The primary issue is that the `moveProjectUp` and `moveProjectDown` functions calculate new order positions based on the full unfiltered project list, but users expect the movement to be relative to the filtered view they're currently working with.

## Key Features

### 1. Enhanced Project Ordering with Filtered Views Support

**Problem**: When users filter projects by status (e.g., showing only WIP projects) and attempt to reorder them, the projects don't move to the expected positions because the ordering calculation uses the full project list rather than the filtered subset.

**Solution**: Implement optional `newOrder` parameter in `moveProjectUp` and `moveProjectDown` functions to allow context-specific ordering calculations.

### 2. Context-Aware Move Functions

**Problem**: Different views (projects page, CRM project details, activity project lists, etc.) have different filtering contexts but use the same ordering functions.

**Solution**: Create view-specific ordering functions that calculate the correct order based on the filtered context and pass the calculated order to the centralized functions.

### 3. Configurable Order Controls

**Problem**: Order controls (up/down buttons) appear in contexts where they're not needed or are disruptive to the user experience.

**Solution**: Add an optional `disableOrderControls` prop to `ProjectAccordionItem` component to hide ordering controls in inappropriate contexts.

### 4. Improved User Experience

**Problem**: Users expect intuitive drag-and-drop or click-to-move behavior that works consistently across all filtered views.

**Solution**: Ensure consistent ordering behavior across all project list views while maintaining the existing UI patterns.

## Technical Implementation Details

### Core Changes

1. **Enhanced ContextProjects API**:

   - Modify `moveProjectUp(projectId: string, newOrder?: number)`
   - Modify `moveProjectDown(projectId: string, newOrder?: number)`
   - When `newOrder` is provided, use it directly instead of calculating from the full list

2. **View-Specific Ordering Logic**:

   - Create helper functions in each filtered view to calculate correct order positions
   - Pass calculated order to the centralized move functions

3. **Component Enhancements**:
   - Add `disableOrderControls?: boolean` prop to `ProjectAccordionItem`
   - Update `DefaultAccordionItem` to conditionally render order controls

### Affected Components

**Core Infrastructure:**

- `api/ContextProjects.tsx` - Core ordering logic with optional `newOrder` parameter
- `components/projects/ProjectAccordionItem.tsx` - Order controls with `disableOrderControls` prop
- `components/ui-elements/accordion/DefaultAccordionItem.tsx` - Order buttons display logic

**Components with Filtering (Need Custom Move Functions):**

- `components/projects/useProjectFilter.tsx` - Filters by WIP/On Hold/Done status
- `components/accounts/ProjectList.tsx` - Uses filtered projects for display
- `components/accounts/AccountProjects.tsx` - Account-specific project filtering
- `components/planning/usePlanningProjectFilter.tsx` - Planning context filtering (Open/Focus/On Hold)

**Components Where Order Controls Should Be Disabled:**

- `components/ui-elements/crm-project-details/crm-project-details.tsx` - Disable controls
- `components/activities/activity-project-list.tsx` - Disable controls
- `components/ui-elements/project-notes-form/project-notes-form.tsx` - Disable controls
