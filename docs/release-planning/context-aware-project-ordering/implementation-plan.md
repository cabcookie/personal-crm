# Implementation Plan: Context-Aware Project Ordering

## Overview

This implementation plan provides step-by-step instructions for implementing context-aware project ordering that allows projects to move relative to visible projects in filtered views, plus configurable sorting UI controls. Each step includes specific tasks and validation criteria.

## Phase 1: Foundation - Configurable Sorting UI Controls

### Step 1: Add disableSorting Prop to ProjectAccordionItem

**Objective**: Extend ProjectAccordionItem component with optional disableSorting prop to control visibility of sorting controls.

**Tasks**:

- Add `disableSorting?: boolean` prop to ProjectAccordionItemProps interface in `components/projects/ProjectAccordionItem.tsx`
- Update component logic to conditionally render onMoveUp and onMoveDown controls based on disableSorting prop
- Ensure default behavior (disableSorting = false) maintains backward compatibility
- Update TypeScript interfaces to include the new prop

**Validation Test**:

- Verify ProjectAccordionItem renders normally when disableSorting is undefined or false
- Verify up/down arrow buttons are completely hidden (not just disabled) when disableSorting is true
- Confirm existing usage of ProjectAccordionItem continues working without changes

### Step 2: Apply disableSorting to Activity Project Lists

**Objective**: Remove sorting controls from activity-related project displays where manual ordering is inappropriate.

**Tasks**:

- Update ActivityProjectList component in `components/activities/activity-project-list.tsx`
- Pass `disableSorting={true}` prop to ProjectAccordionItem instances
- Ensure activity project lists show clean interface without sorting arrows

**Validation Test**:

- Navigate to activity views that display project lists
- Verify no up/down arrow buttons appear on project accordion items
- Confirm project information and other functionality remains intact

### Step 3: Apply disableSorting to Project Notes Forms

**Objective**: Remove sorting controls from project notes forms where sorting functionality is not needed.

**Tasks**:

- Update project-notes-form component in `components/ui-elements/project-notes-form/project-notes-form.tsx`
- Pass `disableSorting={true}` prop to ProjectAccordionItem instances used in notes contexts
- Maintain clean interface focused on note-taking rather than project ordering

**Validation Test**:

- Open project notes forms and verify sorting controls are hidden
- Confirm note editing functionality works correctly
- Ensure project information displays properly without visual clutter

## Phase 2: Context Detection System

### Step 4: Create Filter Context Analysis Utility

**Objective**: Build utility functions to analyze current filtering context and identify visible projects.

**Tasks**:

- Create new utility file `helpers/projects/context-detection.ts`
- Implement `analyzeFilterContext()` function that identifies current page/component context
- Implement `getVisibleProjects()` function that applies current filters to project list
- Add TypeScript interfaces for FilterContext and VisibleProjectsResult

**Validation Test**:

- Test filter context detection across different pages (main projects, planning views, search results)
- Verify visible projects correctly reflect current filter state (WIP, On Hold, Done, search terms)
- Confirm function returns consistent results for same input parameters

### Step 5: Implement Visible Project Boundary Detection

**Objective**: Create logic to determine project positions within filtered/visible project sets.

**Tasks**:

- Add `getProjectPositionInFilteredView()` function to context-detection utilities
- Implement `findAdjacentVisibleProjects()` function to identify next/previous visible projects
- Create `validateMovementWithinBoundaries()` function to ensure movements respect filter constraints

**Validation Test**:

- Test position detection with various filter combinations
- Verify adjacent project detection works correctly at filter boundaries
- Confirm movement validation prevents impossible movements (e.g., moving WIP project into Done section)

## Phase 3: Enhanced Order Calculation Logic

### Step 6: Implement Context-Aware Order Calculation

**Objective**: Create sophisticated order calculation that respects visible project boundaries while maintaining global consistency.

**Tasks**:

- Create new utility file `helpers/projects/order-calculation.ts`
- Implement `calculateContextAwareOrder()` function that determines appropriate order values for filtered views
- Add `mapVisiblePositionToGlobalOrder()` function to translate relative positions to global order values
- Implement `preserveFilterIntegrity()` function to ensure movements don't violate filter boundaries

**Validation Test**:

- Test order calculation with various filter scenarios (state filters, search filters, planning filters)
- Verify calculated order values produce expected visual ordering in filtered views
- Confirm global project ordering remains consistent when switching between filtered and unfiltered views

### Step 7: Enhance moveProjectUp Function with Context Awareness

**Objective**: Modify existing moveProjectUp function in ContextProjects to use context-aware ordering logic.

**Tasks**:

- Update `moveProjectUp` function in `api/ContextProjects.tsx`
- Integrate context detection and visible project analysis
- Implement logic to move projects relative to visible projects rather than all projects
- Maintain optimistic UI updates and error handling patterns

**Validation Test**:

- Test moving WIP project up in filtered view produces immediate visual change
- Verify project moves to correct position relative to other visible WIP projects
- Confirm error rollback works correctly if API call fails

### Step 8: Enhance moveProjectDown Function with Context Awareness

**Objective**: Apply same context-aware logic to moveProjectDown function for consistent behavior.

**Tasks**:

- Update `moveProjectDown` function in `api/ContextProjects.tsx`
- Apply same context detection and visible project logic as moveProjectUp
- Ensure consistent behavior between up and down movements
- Preserve existing optimistic updates and error handling

**Validation Test**:

- Test moving projects down in filtered views produces expected results
- Verify consistent behavior between moveProjectUp and moveProjectDown
- Confirm movements work correctly at both top and bottom boundaries of filtered lists

## Phase 4: Cross-Context Integration

### Step 9: Integrate Context-Aware Ordering with Main Projects Page

**Objective**: Ensure context-aware ordering works correctly with state-filtered project views.

**Tasks**:

- Verify context detection correctly identifies main projects page filtering (WIP, On Hold, Done)
- Test project movements within each filter category
- Ensure project movements respect state boundaries (WIP projects move relative to other WIP projects)

**Validation Test**:

- Filter projects by WIP and test moving projects up/down produces immediate visual feedback
- Repeat test for On Hold and Done filters
- Verify projects don't cross state boundaries during movements

### Step 10: Integrate Context-Aware Ordering with Planning Views

**Objective**: Apply context-aware ordering to weekly and daily planning project views.

**Tasks**:

- Update planning view components to work with enhanced ordering logic
- Verify context detection identifies planning-specific filters
- Ensure project movements work within planning constraints (timeline, focus, availability)

**Validation Test**:

- Test project movements in weekly planning view (`components/planning/week/PlanWeekProjectList.tsx`)
- Test project movements in daily planning view (`pages/planday.tsx`)
- Verify movements respect planning-specific filter criteria

### Step 11: Integrate Context-Aware Ordering with Search Results

**Objective**: Ensure project ordering works correctly within search result contexts.

**Tasks**:

- Verify context detection identifies search filtering scenarios
- Test project movements within search results maintain search context
- Ensure moved projects remain visible if they still match search criteria

**Validation Test**:

- Perform project search and test moving projects within search results
- Verify moved projects remain in search results if they still match criteria
- Confirm search state is preserved during project movements

## Phase 5: Testing and Validation

### Step 12: Comprehensive Cross-Browser Testing

**Objective**: Validate context-aware ordering works consistently across different browsers and devices.

**Tasks**:

- Test all project movement scenarios in Chrome, Firefox, Safari, and Edge
- Verify mobile responsiveness of enhanced ordering functionality
- Test touch interactions for project movements on mobile devices

**Validation Test**:

- Project movements work correctly on all major browsers
- Mobile interface provides appropriate touch targets for project ordering
- No visual glitches or layout issues across different screen sizes

### Step 13: Performance Testing and Optimization

**Objective**: Ensure enhanced ordering logic doesn't negatively impact application performance.

**Tasks**:

- Profile order calculation performance with large project lists (100+ projects)
- Verify optimistic UI updates remain responsive (<200ms)
- Test memory usage with frequent project movements

**Validation Test**:

- Project movements complete within 200ms on average
- No memory leaks detected during extended project ordering sessions
- Application remains responsive with large project datasets

### Step 14: Error Handling and Edge Case Testing

**Objective**: Validate robust error handling and recovery for edge cases.

**Tasks**:

- Test project movements with poor network connectivity
- Verify error recovery when API calls fail
- Test concurrent project movements by multiple users
- Handle edge cases like empty filter results or single-project lists

**Validation Test**:

- Failed project movements trigger appropriate error messages and UI rollback
- Concurrent movements don't create data inconsistencies
- Edge cases (empty lists, single projects) handle gracefully without errors

## Phase 6: Final Integration and Documentation

### Step 15: Integration Testing Across All Contexts

**Objective**: Comprehensive testing of context-aware ordering across all supported contexts.

**Tasks**:

- Test complete user workflows involving multiple project management contexts
- Verify consistent behavior when switching between filtered and unfiltered views
- Ensure context-aware ordering doesn't break existing normalization and migration systems

**Validation Test**:

- User can move projects in main list, then switch to planning view and see consistent ordering
- Project normalization system continues working correctly with context-aware movements
- Legacy project migration system remains functional

### Step 16: User Acceptance Testing Preparation

**Objective**: Prepare enhanced ordering system for user testing and feedback.

**Tasks**:

- Document new behavior and expected user interactions
- Create test scenarios for user acceptance testing
- Prepare rollback procedures in case of issues

**Validation Test**:

- All test scenarios execute successfully
- Documentation accurately describes new behavior
- Rollback procedures tested and validated

### Step 17: Final Code Review and Optimization

**Objective**: Ensure code quality, maintainability, and adherence to project standards.

**Tasks**:

- Conduct comprehensive code review of all changes
- Optimize any performance bottlenecks identified during testing
- Ensure TypeScript types are accurate and comprehensive
- Verify all functions have appropriate error handling

**Validation Test**:

- Code passes all linting and type checking
- No console errors or warnings in browser development tools
- All functions handle edge cases and errors appropriately

## Success Criteria

The implementation is complete when:

1. **Filtered View Movements**: Projects move relative to visible projects in all filtered contexts
2. **Clean UI**: Sorting controls only appear where appropriate (disableSorting prop works)
3. **No Regressions**: All existing project ordering functionality preserved
4. **Performance**: Project movements complete within 200ms with immediate visual feedback
5. **Cross-Context Consistency**: Same behavior across all project management interfaces
6. **Error Handling**: Robust error recovery and user feedback
7. **Browser Compatibility**: Works consistently across all major browsers and devices

Each step should be completed and validated before proceeding to the next step. The implementation should maintain backward compatibility throughout the development process.
