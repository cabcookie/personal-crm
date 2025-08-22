# Release Plan: Fix Project List UI

## Overview

Fix visual issues with the pinned projects list and accordion item layout to improve user experience and visual hierarchy.

## Issues Identified

### Issue 1: Weak Visual Separation for Pinned Projects

**Current State:**

- Pinned projects section lacks strong visual distinction from regular projects
- Only differentiated by a small pin icon and text label "1 pinned projects"
- No clear visual boundary or background differentiation

**Impact:**

- Users may not immediately recognize the importance of pinned projects
- Reduced effectiveness of the pinning feature

### Issue 2: Order Button Alignment with Trigger Subtitle

**Current State:**

- Order buttons (up/down arrows) are properly aligned with the trigger title
- However, the trigger subtitle text is not indented to match, causing misalignment
- Creates visual inconsistency when order buttons are present

**Impact:**

- Poor visual hierarchy
- Subtitle appears misaligned with the title content

## Implementation Plan

### Phase 1: Enhanced Visual Separation for Pinned Projects

#### Changes to `PinnedProjectList.tsx`

1. **Add distinct background color**
   - Apply a subtle background color to the pinned section container
   - Use CSS variable for theme compatibility

2. **Add border and spacing**
   - Add a border around the pinned projects section
   - Increase padding inside the container
   - Add margin-bottom to separate from regular projects

3. **Enhance header styling**
   - Make the "X pinned projects" header more prominent
   - Consider adding a background color to the header
   - Increase font weight or size

#### Specific Implementation

```tsx
// Wrap the pinned projects in a styled container
<div className="border border-border rounded-lg bg-muted/30 p-3 mb-6">
  <div className="flex items-center gap-2 mb-3 pb-2 border-b">
    <Pin size={16} className="text-primary" />
    <span className="text-sm font-semibold">
      {pinnedProjects.length} pinned{" "}
      {pinnedProjects.length === 1 ? "project" : "projects"}
    </span>
  </div>
  <Accordion>{/* ... existing accordion content ... */}</Accordion>
</div>
```

### Phase 2: Fix Order Button Alignment

#### Changes to `DefaultAccordionItem.tsx`

1. **Restructure trigger layout**
   - Ensure consistent left padding for both title and subtitle when order buttons are present
   - Create a wrapper div that handles the indent for both elements

2. **Update the AccordionTrigger structure**
   - Move order buttons outside the main content flow
   - Move badge into the section with title and action buttons
   - Use CSS Grid or Flexbox for proper alignment

#### Specific Implementation

```tsx
// Restructure the trigger content layout
<AccordionTrigger>
  <div className="flex items-start gap-2 w-full">
    {/* Order buttons and badge column */}
    {(onMoveUp || onMoveDown || badge) && (
      <div className="shrink-0">
        {!disableOrderControls && (
          <OrderButtons onMoveDown={onMoveDown} onMoveUp={onMoveUp} />
        )}
      </div>
    )}

    {/* Content column - both title and subtitle */}
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2">
        <div className="shrink-0">{badge}</div>
        <div className="flex-1 truncate">{triggerTitle}</div>
        <div className="shrink-0 flex items-center gap-1.5">
          {actionIcon}
          {link && <BiLinkExternal />}
          {onDelete && <Trash2 />}
        </div>
      </div>
      {/* Subtitle now properly aligned with title */}
      <AccordionTriggerSubTitle>
        {/* ... subtitle content ... */}
      </AccordionTriggerSubTitle>
    </div>
  </div>
</AccordionTrigger>
```

## Testing Checklist

- [ ] Pinned projects section has clear visual distinction
- [ ] Visual separation works in both light and dark themes
- [ ] Order buttons align properly with both title and subtitle
- [ ] Subtitle text starts at the same horizontal position as the title
- [ ] All interactive elements remain functional
- [ ] No layout shifts when expanding/collapsing items
- [ ] Mobile responsive layout maintained
- [ ] Performance impact minimal (no unnecessary re-renders)

## Rollback Plan

If issues arise:

1. Revert changes to `DefaultAccordionItem.tsx`
2. Revert changes to `PinnedProjectList.tsx`
3. Clear browser cache and restart development server

## Success Metrics

- Improved visual hierarchy between pinned and regular projects
- Consistent alignment across all accordion items
- No regression in existing functionality
- Positive user feedback on improved clarity

## Timeline

- Phase 1: 30 minutes (Visual separation for pinned projects)
- Phase 2: 45 minutes (Fix alignment issues)
- Testing: 15 minutes
- Total estimated time: 1.5 hours
