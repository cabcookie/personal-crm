# Implementation Plan: Project Ordering Fix Release

This implementation plan provides step-by-step instructions for AI developers to fix the project ordering functionality in filtered views. Each step groups related functionality to deliver complete, working features.

## Step 1: Disable Order Controls in Inappropriate Contexts

**Objective**: Remove order controls from contexts where they are not needed or disruptive to user experience.

**Implementation**:

- Add `disableOrderControls?: boolean` prop to `components/projects/ProjectAccordionItem.tsx` and pass it through to `DefaultAccordionItem`
- Update `components/ui-elements/accordion/DefaultAccordionItem.tsx` to add the `disableOrderControls` prop to its interface and conditionally render order controls (ChevronUp/ChevronDown buttons) only when the prop is not true
- Update `components/ui-elements/crm-project-details/crm-project-details.tsx` to pass `disableOrderControls={true}` to all ProjectAccordionItem instances within CRM project details
- Update `components/activities/activity-project-list.tsx` to pass `disableOrderControls={true}` to all ProjectAccordionItem instances in activity contexts
- Update `components/ui-elements/project-notes-form/project-notes-form.tsx` to pass `disableOrderControls={true}` to all ProjectAccordionItem instances in notes form contexts
- Verify that disabled contexts display projects correctly without ordering buttons and maintain proper layout without the controls

## Step 2: Enhance Core API for Filtered Ordering

**Objective**: Implement the foundational API changes to support dedicated moveUp/moveDown functions in filtered project lists.

**Implementation**:

- Update `api/ContextProjects.tsx` to modify `moveProjectUp` and `moveProjectDown` function signatures to accept optional `newOrder` parameter: `(projectId: string, newOrder?: number)`
- Modify the implementation logic to use provided `newOrder` directly when available, maintaining existing calculation logic for backward compatibility
- Update the `ProjectsContextType` interface to reflect new function signatures
- Ensure all changes maintain backward compatibility with existing usage patterns

## Step 3: Implement Complete Project Filter Ordering System

**Objective**: Build the full filtered ordering functionality for project status filters (WIP, On Hold, Done).

**Implementation**:

- Create order calculation helper functions in `components/projects/useProjectFilter.tsx`: `calculateMoveUpOrder` and `calculateMoveDownOrder` that take current project and filtered projects array, returning appropriate order values for movement within filtered context
- Implement logic to find adjacent projects in filtered lists and calculate midpoint order values, handling edge cases for first/last positions
- Add `moveProjectUp` and `moveProjectDown` functions to the `ProjectFilterType` interface and implement them in `ProjectFilterProvider` using helper functions to calculate order then call ContextProjects functions with calculated values
- Update `components/accounts/ProjectList.tsx` to use filtered move functions from `useProjectFilter` hook instead of global context functions, ensuring proper error handling and loading states
- Verify integration works correctly with `components/accounts/AccountProjects.tsx` for account-specific filtering combined with status filtering

## Step 4: Implement Complete Planning Filter Ordering System

**Objective**: Build the full filtered ordering functionality for planning context filters (Open, Focus, On Hold).

**Implementation**:

- Create planning-specific order calculation functions in `components/planning/usePlanningProjectFilter.tsx`: `calculateMoveUpOrder` and `calculateMoveDownOrder` that handle different planning filter types and account for planning-specific sorting logic
- Add `moveProjectUp` and `moveProjectDown` functions to the `PlanningProjectFilterType` interface and implement them using planning-specific helper functions
- Export these functions through the planning context and ensure proper integration with existing planning views and functionality
- Verify that planning filtered ordering works correctly across all planning filter states (Open, Focus, On Hold) and respects planning-specific business logic

This consolidated implementation plan delivers complete, working functionality in each step while maintaining system integrity and user experience consistency.
