# Release Design Document: Manual Project Ordering

## Overview

This release introduces manual project ordering functionality to replace the current automatic ordering system. Users will be able to manually reorder projects within each context using drag-like controls, providing better control over project prioritization. The system will maintain context-specific ordering and automatically normalize order values when needed.

The current system automatically orders projects based on account importance and pipeline volume calculations. This release deprecates that approach in favor of user-controlled ordering through a new `order` field and intuitive UI controls.

## Key Features

### 1. Database Schema Enhancement

**Purpose**: Add persistent storage for manual project ordering

**Details**:

- Add `order` field (float) to the Projects model in `amplify/data/project-schema.ts`
- Default order value assignment for new projects (highest existing order + 1)
- Context-specific ordering (order values are independent per context)
- Migration strategy for existing projects without order values

**Acceptance Criteria**:

- New `order` field is added to Projects schema
- Existing projects receive appropriate order values during migration
- New projects automatically get assigned the next available order number
- Order values are scoped per context

### 2. Manual Reordering Logic

**Purpose**: Implement insertion-based ordering mechanism

**Details**:

- When moving a project between two others, calculate new order as midpoint
- Example: Moving project with order 3 between projects with orders 1 and 2 results in order 1.5
- Handle edge cases (moving to first/last position)
- Maintain relative ordering of other projects

**Acceptance Criteria**:

- Projects can be moved up or down in the list
- Order calculation correctly handles insertion between any two projects
- Edge cases (top/bottom movements) work correctly
- Other projects maintain their relative positions

### 3. Order Normalization System

**Purpose**: Prevent order value fragmentation and maintain clean integer sequences

**Details**:

- Detect when order numbers are non-sequential or non-integer
- Wait 1 minute using deduplication before normalizing
- Backend normalization: update database values sequentially from highest to lowest
- Per-context normalization (separate for family, work, hobby contexts)

**Acceptance Criteria**:

- System detects fragmented order values automatically
- Normalization waits appropriate time before executing
- Database gets updated with clean integer sequence
- Normalization should not have consequences for the frontend
- Process works independently for each context

### 4. Enhanced UI Controls

**Purpose**: Provide intuitive reordering interface in project accordions

**Details**:

- Add up/down arrow buttons to the left side of accordion triggers
- Buttons only visible when reordering functions are provided
- Responsive design that works on both desktop and mobile
- Visual feedback during reordering operations (the 2 projects swap positions; one moves up, the other moves down; the project acted upon is in front of the other)
- Integration with existing `DefaultAccordionItem` component

**Acceptance Criteria**:

- Up/down arrows appear on the left side of project accordion items
- Arrows are only visible when reorder functionality is available
- UI works responsively on mobile and desktop
- Clicking arrows triggers appropriate reordering logic
- Visual feedback confirms successful reordering

### 5. Context-Aware Project Sorting

**Purpose**: Ensure project lists are consistently ordered by the new order field

**Details**:

- Update project fetching logic to sort by `order` field instead of calculated pipeline value
- Maintain context separation (family projects sorted separately from work projects)
- Update all project list displays to use the new ordering
- Deprecate old pipeline-based ordering logic

**Acceptance Criteria**:

- All project lists display in order field sequence
- Context separation is maintained
- Old automatic ordering logic is no longer used
- Performance remains optimal with new sorting

### 6. Legacy Migration Support

**Purpose**: Smooth transition from automatic to manual ordering

**Details**:

- Detect projects without order values
- Assign initial order values based on current automatic ordering
- Provide migration path that doesn't disrupt existing user workflows
- Mark old pipeline-based ordering as deprecated but maintain for reference

**Acceptance Criteria**:

- Existing projects receive sensible initial order values
- Migration happens transparently without user intervention
- Old ordering system remains available during transition period
- No data loss or corruption during migration
