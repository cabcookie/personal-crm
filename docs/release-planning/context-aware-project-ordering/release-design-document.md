# Release Design Document: Context-Aware Project Ordering

## Overview

This release addresses critical user experience issues with the manual project ordering system introduced in the previous version. The current implementation moves projects within the entire database collection rather than within filtered views, creating confusion when users expect projects to move relative to other visible projects. Additionally, project accordion items show unnecessary sorting controls in contexts where manual ordering isn't applicable.

The release implements **context-aware project ordering** that respects filtered views and provides granular control over sorting UI visibility, ensuring intuitive user interactions across all project management interfaces.

## Key Features

### 1. Filtered View Project Ordering

The primary enhancement allows projects to move relative to other **visible** projects in filtered views rather than all projects in the database.

**Current Problem**:

- Projects filtered by state (WIP, On Hold, Done) show only subset of projects
- Moving a WIP project "up" may place it between WIP and On Hold projects in database
- User sees no visual change in filtered view, requiring multiple moves to see effect
- Creates frustrating user experience where actions don't produce expected results

**Solution**:

- Calculate new order values based on visible projects in current filter context
- Maintain global ordering while respecting visual boundaries of filtered views
- Ensure immediate visual feedback for all project movements
- Support consistent behavior across all filtering scenarios (state, search, planning views)

### 2. Configurable Sorting UI Controls

Introduces granular control over project sorting interface elements to prevent UI clutter in inappropriate contexts.

**Current Problem**:

- ProjectAccordionItem shows up/down arrow buttons in all contexts
- Activity project lists and project notes forms display unnecessary sorting controls
- Creates visual noise and potential user confusion in non-sorting contexts

**Solution**:

- Add `disableSorting` boolean prop to ProjectAccordionItem component
- Hide sorting controls completely when disabled (not just gray out)
- Maintain backward compatibility with existing implementations
- Apply to activity lists, project notes forms, and other non-sorting contexts

### 3. Cross-Context Ordering Intelligence

Enhances the ordering system to work seamlessly across different project management views and contexts.

**Supported Contexts**:

- **Main Projects Page**: Filtered by project state (WIP, On Hold, Done)
- **Weekly Planning**: Projects filtered by planning criteria and timeline
- **Daily Planning**: Projects filtered by daily focus and availability
- **Activity Views**: Projects shown in activity contexts (read-only ordering)
- **Search Results**: Projects filtered by search terms

**Intelligent Order Calculation**:

- Identifies the current filtering context automatically
- Calculates appropriate order values that respect visual boundaries
- Maintains consistency with global project ordering for unfiltered views
- Preserves existing normalization and migration logic

### 4. Enhanced User Feedback

Improves user experience with better visual feedback and error handling for project movements.

**Visual Improvements**:

- Immediate visual updates when projects are moved in filtered views
- Clear indication when movements reach filter boundaries
- Consistent behavior across desktop and mobile interfaces
- Preserved optimistic UI updates with proper error rollback

**Error Handling**:

- Graceful handling of order conflicts in filtered contexts
- Automatic recovery from failed movements with user notification
- Preservation of filter state during project manipulations
- Consistent error messaging across all contexts

## Technical Implementation Details

### Order Calculation Algorithm

The release implements a sophisticated order calculation algorithm that:

1. **Identifies Visible Projects**: Analyzes current filter state to determine which projects are visible
2. **Calculates Relative Positions**: Determines target position within visible project set
3. **Maps to Global Order**: Translates relative position to appropriate global order value
4. **Preserves Filter Integrity**: Ensures movements don't violate filter boundaries

### Context Detection System

A context detection system automatically identifies:

- Current page or component requesting project movement
- Active filters and their parameters
- Expected user behavior based on interface context
- Appropriate order calculation strategy

### Backward Compatibility

All changes maintain full backward compatibility:

- Existing project ordering behavior preserved for unfiltered views
- Default props ensure existing ProjectAccordionItem usage unaffected
- Legacy normalization and migration systems continue working
- No database schema changes required

## User Experience Improvements

### Before This Release

1. **Filtered View Movements**: User moves WIP project up → no visible change → user confused
2. **Multiple Attempts**: User clicks up arrow multiple times to see movement
3. **Inconsistent Behavior**: Different movement behavior in different views
4. **UI Clutter**: Sorting arrows shown everywhere, even where inappropriate

### After This Release

1. **Immediate Feedback**: User moves WIP project up → immediate visual change in filtered view
2. **Single Action**: One click produces expected result
3. **Consistent Experience**: Same movement logic across all project views
4. **Clean Interface**: Sorting controls only shown where relevant

## Impact on Existing Features

### Preserved Functionality

- **Global Project Ordering**: Master project order maintained across contexts
- **Normalization System**: Automatic order cleanup continues working
- **Legacy Migration**: Existing project migration logic preserved
- **Multi-Context Support**: Family/Work/Hobby context separation maintained

### Enhanced Functionality

- **Weekly Planning**: Project movements now respect planning-specific filters
- **Daily Planning**: Project ordering works within daily focus constraints
- **Activity Management**: Clean interface without unnecessary sorting controls
- **Search Integration**: Project movements work within search result contexts

## Risk Mitigation

### Technical Risks

1. **Order Conflicts**: Mitigated by sophisticated conflict detection and resolution
2. **Performance Impact**: Minimal overhead from context detection system
3. **Filter Complexity**: Handled by centralized filter analysis logic
4. **Legacy Compatibility**: Extensive testing of existing functionality

### User Experience Risks

1. **Behavior Changes**: Gradual introduction with clear user feedback
2. **Learning Curve**: Improvements make interface more intuitive, not complex
3. **Visual Consistency**: Maintained across all contexts and devices
4. **Error Recovery**: Robust rollback mechanisms for failed operations

## Success Criteria

### Primary Objectives

1. **Filtered Movements Work**: Projects move relative to visible projects in filtered views
2. **Clean UI**: Sorting controls only appear where appropriate
3. **No Regressions**: All existing project ordering functionality preserved
4. **Cross-Context Consistency**: Same behavior across all project management interfaces

### Performance Metrics

- **User Action Success Rate**: 100% of project movements produce immediate visual feedback
- **Error Rate**: <1% of project movements result in errors or inconsistencies
- **Interface Clarity**: Sorting controls appear only in relevant contexts
- **Response Time**: Project movements complete within 200ms optimistically

### User Satisfaction Indicators

- Elimination of multiple-click project movements
- Reduced user confusion about project ordering
- Cleaner interface in activity and notes contexts
- Consistent experience across planning workflows
