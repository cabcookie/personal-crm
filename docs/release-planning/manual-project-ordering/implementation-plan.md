# Implementation Plan: Manual Project Ordering

This document provides step-by-step instructions for implementing manual project ordering functionality. Each step includes specific implementation details and validation criteria.

## Phase 1: Database Schema Updates

### Step 1: Add Order Field to Projects Schema

**Objective**: Extend the Projects model with an `order` field for manual sorting

**Instructions**:

- Open `amplify/data/project-schema.ts`
- Add `order: a.float()` field to the Projects model definition
- Ensure the field is optional to handle existing projects without order values
- Add the Projects table to `tablesWithDeleteProtection` array if not already present

**Validation**:

- Run `npx ampx sandbox` to deploy schema changes
- Verify the `order` field appears in the generated GraphQL schema
- Check that existing projects can still be queried without errors
- Confirm new projects can be created with order values

### Step 2: Update TypeScript Types

**Objective**: Extend TypeScript interfaces to include the new order field

**Instructions**:

- Update the `Project` type in `api/ContextProjects.tsx` to include `order?: number`
- Modify the `selectionSet` array to include `"order"` field
- Update the `mapProject` function to handle the new `order` field from the database
- Set a default order value when mapping projects without order (use current pipeline calculation as fallback)

**Validation**:

- TypeScript compilation succeeds without errors
- Project lists can be fetched and displayed correctly
- New and existing projects both display properly
- Order field is accessible in project objects throughout the application

## Phase 2: Project Creation Logic

### Step 3: Implement Automatic Order Assignment for New Projects

**Objective**: Ensure new projects get assigned appropriate order values

**Instructions**:

- Modify the `createProject` function in `api/ContextProjects.tsx`
- Before creating a project, calculate the highest existing order value for the given context
- Set the new project's order to `Math.max(...existingOrders) + 1` or `1` if no projects exist
- Update both the optimistic UI update and the actual database creation

**Validation**:

- Create a new project and verify it appears at the end of the project list
- Verify the order value is correctly assigned (highest + 1)
- Test with different contexts to ensure order values are context-specific
- Check that multiple rapid project creations work correctly

### Step 4: Update Project Sorting Logic

**Objective**: Replace pipeline-based sorting with order-based sorting

**Instructions**:

- Modify the `fetchProjects` function in `api/ContextProjects.tsx`
- Change the sorting logic from pipeline-based to order-based
- Add fallback sorting by creation date when order values are equal
- Update the `mapProject` function to remove dependence on pipeline calculation for ordering
- Keep pipeline calculation for display purposes but not for sorting

**Validation**:

- Project lists display in correct order (by order field, then by creation date)
- Context separation is maintained (family projects separate from work projects)
- Performance remains good with order-based sorting
- Legacy projects without order values still display correctly

## Phase 3: Manual Reordering Implementation

### Step 5: Create Project Reordering Functions

**Objective**: Implement the core logic for manual project reordering

**Instructions**:

- Add `moveProjectUp` and `moveProjectDown` functions to `api/ContextProjects.tsx`
- Implement insertion-based ordering logic (calculate midpoint between adjacent projects)
- Handle edge cases: moving to first position (order - 0.5) and last position (order + 1)
- Use optimistic updates with SWR to provide immediate UI feedback
- Ensure context-aware reordering (only reorder within the same context)

**Validation**:

- Test moving projects up and down in the list
- Verify projects maintain correct relative positions
- Check edge cases (first and last positions)
- Confirm optimistic updates work correctly
- Test with projects from different contexts

### Step 6: Add Reordering Functions to Context Provider

**Objective**: Expose reordering functionality through the context API

**Instructions**:

- Add `moveProjectUp` and `moveProjectDown` to the `ProjectsContextType` interface
- Include these functions in the context provider return value
- Ensure proper error handling and user feedback through toast notifications
- Add proper TypeScript types for all function parameters and return values

**Validation**:

- Functions are accessible from components using `useProjectsContext()`
- Error handling works correctly (shows appropriate error messages)
- Success feedback is provided to users
- TypeScript types are correctly defined and enforced

## Phase 4: UI Controls Implementation

### Step 7: Extend DefaultAccordionItem with Reorder Controls

**Objective**: Add up/down arrow buttons to accordion items

**Instructions**:

- Open `components/ui-elements/accordion/DefaultAccordionItem.tsx`
- Add optional `onMoveUp` and `onMoveDown` props to the component interface
- Add up and down arrow buttons to the left side of the trigger
- Use Lucide React icons (ChevronUp, ChevronDown) for the arrows
- Style buttons to be visible but not intrusive, with proper hover states
- Ensure buttons only appear when the callback functions are provided

**Validation**:

- Arrow buttons appear on the left side of accordion triggers when functions are provided
- Buttons are hidden when no functions are provided
- Hover states and button styling work correctly
- Clicking buttons triggers the appropriate callback functions
- Layout works on both desktop and mobile devices

### Step 8: Integrate Reordering in ProjectAccordionItem

**Objective**: Connect the UI controls to the reordering logic

**Instructions**:

- Open `components/projects/ProjectAccordionItem.tsx`
- Add `showReorderControls` prop to control when reorder buttons are displayed
- Use `useProjectsContext()` to access `moveProjectUp` and `moveProjectDown` functions
- Pass the reordering functions to `DefaultAccordionItem` as `onMoveUp` and `onMoveDown`
- Handle the project ID parameter correctly when calling reorder functions

**Validation**:

- Reorder buttons appear in project accordion items when `showReorderControls` is true
- Clicking up/down arrows successfully reorders projects
- UI provides immediate feedback during reordering
- Projects maintain their expanded/collapsed state during reordering
- Error states are handled gracefully

### Step 9: Enable Reordering in Project Lists

**Objective**: Activate reordering functionality in the main project list component

**Instructions**:

- Open `components/accounts/ProjectList.tsx`
- Pass `showReorderControls={true}` to `ProjectAccordionItem` components
- Ensure the project list updates correctly after reordering operations
- Add any necessary loading states during reorder operations

**Validation**:

- Reorder controls are visible in the main project list
- Projects can be successfully reordered using the arrow buttons
- List updates immediately reflect the new order
- Loading states provide appropriate user feedback

## Phase 5: Order Normalization System

### Step 10: Implement Order Detection Logic

**Objective**: Create system to detect when order normalization is needed

**Instructions**:

- Create a utility function to detect non-sequential or non-integer order values
- Add this detection to the project fetching logic in `api/ContextProjects.tsx`
- Implement a debounced trigger (1-minute delay) before normalization begins
- Use SWR's revalidation system to coordinate the normalization timing

**Validation**:

- System correctly identifies when order values need normalization
- Detection works for both non-integer and non-sequential scenarios
- Debouncing prevents excessive normalization attempts
- Detection is context-aware (separate for each context)

### Step 11: Create Order Normalization Function

**Objective**: Implement the backend normalization process

**Instructions**:

- Add a `normalizeProjectOrders` function to `api/ContextProjects.tsx`
- Sort projects by current order, then reassign sequential integer values (1, 2, 3, etc.)
- Process projects from highest to lowest order to avoid conflicts
- Update projects one by one in the database to prevent race conditions
- Make the process context-aware (normalize only projects within the same context)

**Validation**:

- Normalization correctly assigns sequential integer values
- Process works from highest to lowest order as specified
- Context separation is maintained during normalization
- Database updates complete successfully without conflicts
- UI remains responsive during normalization process

### Step 12: Integrate Normalization with Project Loading

**Objective**: Automatically trigger normalization when needed

**Instructions**:

- Integrate order detection with the project loading process
- Trigger normalization automatically after the 1-minute delay
- Ensure normalization doesn't interfere with active user interactions
- Provide subtle feedback when normalization is occurring (optional loading indicator)

**Validation**:

- Normalization triggers automatically when fragmented orders are detected
- User interactions aren't disrupted during normalization
- Projects maintain correct order after normalization completes
- System handles multiple contexts independently

## Phase 6: Migration and Legacy Support

### Step 13: Implement Legacy Project Migration

**Objective**: Assign initial order values to existing projects

**Instructions**:

- Create a migration function to assign order values to projects without them
- Use the current pipeline-based sorting as the basis for initial order assignment
- Process projects context by context to maintain separation
- Run migration automatically when projects without orders are detected
- Preserve existing project relationships and data integrity

**Validation**:

- Existing projects without order values receive appropriate initial orders
- Migration preserves the current visual order of projects
- Process completes without data loss or corruption
- Different contexts are processed independently
- Migration runs only once per project (idempotent)

### Step 14: Update Project Filtering Logic

**Objective**: Ensure all project lists use the new ordering system

**Instructions**:

- Review `components/projects/useProjectFilter.tsx` and related filtering logic
- Update any remaining references to pipeline-based sorting
- Ensure filtered project lists maintain correct order-based sorting
- Update search and filter functions to preserve manual ordering

**Validation**:

- All project lists throughout the application display in correct order
- Filtering and searching preserve the manual ordering
- No components still rely on old pipeline-based sorting
- Performance remains optimal with the new sorting system
