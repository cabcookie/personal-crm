# Manual Project Ordering - Project Architecture

This document outlines the high-level architecture and file structure relevant to the manual project ordering feature implementation.

## Technology Stack

- **Framework**: Next.js 14 with Pages Router
- **Backend**: AWS Amplify Gen2 with GraphQL API
- **Database**: Amazon DynamoDB
- **State Management**: SWR for data fetching and caching
- **UI Components**: React with Radix UI primitives
- **Styling**: TailwindCSS
- **Type Safety**: TypeScript throughout the stack

## Key Directories and Files

### Backend Schema (`amplify/`)

```
amplify/
├── backend.ts                    # Main backend configuration
├── data/
│   ├── resource.ts              # Main data resource configuration
│   ├── project-schema.ts        # ✅ Projects model with order field
│   ├── account-schema.ts        # Account management schemas
│   ├── person-schema.ts         # Person/contact schemas
│   └── ...                      # Other domain schemas
├── auth/
│   └── resource.ts              # Authentication configuration
└── storage/
    └── resource.ts              # S3 storage configuration
```

**Key Files for Manual Ordering:**

- `amplify/data/project-schema.ts` - Contains Projects model with the new `order: a.float()` field

### Data Layer (`api/`)

```
api/
├── ContextProjects.tsx          # 🎯 Main projects context and data operations
├── ContextAccounts.tsx          # Account management context
├── globals.ts                   # Global API utilities
├── useCrmProjects.ts           # CRM project integration
├── useProjectTodos.ts          # Project todos management
└── projects/
    ├── add-project-activity.ts  # Project activity operations
    └── update-project.ts        # Project update operations
```

**Key Files for Manual Ordering:**

- `api/ContextProjects.tsx` - ✅ Updated with order-related types, functions, and sorting logic

### UI Components (`components/`)

```
components/
├── projects/
│   ├── ProjectAccordionItem.tsx    # 🎯 Individual project display (reorder controls)
│   ├── ProjectList.tsx             # 🎯 Main project list component
│   └── ...                         # Other project components
├── ui-elements/
│   └── accordion/
│       └── DefaultAccordionItem.tsx # 🎯 Base accordion (will add reorder buttons)
├── ui/                             # Radix UI primitives
│   ├── accordion.tsx               # Accordion component
│   ├── button.tsx                  # Button component
│   └── ...                         # Other UI primitives
└── accounts/
    ├── AccountDetails.tsx          # Account detail view
    ├── ProjectList.tsx             # 🎯 Account-specific project list
    └── ...                         # Other account components
```

**Key Files for Manual Ordering:**

- `components/ui-elements/accordion/DefaultAccordionItem.tsx` - Will add up/down reorder buttons
- `components/projects/ProjectAccordionItem.tsx` - Will integrate reorder controls
- `components/accounts/ProjectList.tsx` - Will enable reorder controls in main project list

### Pages (`pages/`)

```
pages/
├── _app.tsx                     # Next.js app configuration
├── index.tsx                    # Home page
├── projects/
│   ├── index.tsx               # Projects list page
│   └── [id].tsx                # Individual project page
├── accounts/
│   ├── index.tsx               # Accounts list page
│   └── [id].tsx                # Account detail page (shows projects)
└── ...                         # Other pages
```

**Key Files for Manual Ordering:**

- `pages/projects/index.tsx` - Main projects page where reordering will be available
- `pages/accounts/[id].tsx` - Account detail page showing account-specific projects

### Supporting Architecture

```
helpers/
├── projects.ts                  # 🎯 Project utility functions
├── functional.ts                # Functional programming utilities
└── ...                         # Other helper modules

contexts/
├── ContextContext.tsx           # Context management (family/work/hobby)
└── NavMenuContext.tsx          # Navigation state management
```

## Data Flow Architecture

### Current State (Pre-Manual Ordering)

```
1. Pages (projects/index.tsx, accounts/[id].tsx)
   ↓
2. Components (ProjectList.tsx, ProjectAccordionItem.tsx)
   ↓
3. Context (ContextProjects.tsx)
   ↓
4. GraphQL API (AWS AppSync)
   ↓
5. DynamoDB (Projects table)
```

**Current Sorting**: Based on calculated pipeline values and account importance

### Target State (With Manual Ordering)

```
1. Pages (projects/index.tsx, accounts/[id].tsx)
   ↓
2. Components (ProjectList.tsx + reorder controls)
   ↓
3. Enhanced Context (ContextProjects.tsx + reorder functions)
   ↓
4. GraphQL API (with order field mutations)
   ↓
5. DynamoDB (Projects table with order field)
```

**New Sorting**: Based on `order` field values, with automatic normalization

## Implementation Strategy

### Phase 1: Database & Types (Steps 1-2)

- ✅ Add `order` field to Projects schema
- 🎯 Update TypeScript types and interfaces

### Phase 2: Core Logic (Steps 3-4)

- 🎯 Automatic order assignment for new projects
- 🎯 Order-based sorting logic

### Phase 3: UI Controls (Steps 5-9)

- 🎯 Reordering functions (`moveProjectUp`, `moveProjectDown`)
- 🎯 UI controls in DefaultAccordionItem
- 🎯 Integration in project lists

### Phase 4: System Maintenance (Steps 10-12)

- 🎯 Order normalization system
- 🎯 Legacy project migration
- 🎯 Automatic maintenance triggers

### Phase 5: Testing & Documentation (Steps 13-16)

- 🎯 Comprehensive testing
- 🎯 Documentation updates
- 🎯 Code cleanup

## Context-Aware Architecture

The application organizes data by context (family, work, hobby):

- **Context Separation**: Project ordering is maintained separately per context
- **Context Provider**: `ContextContext.tsx` manages the current context
- **Context-Aware Sorting**: Order values are scoped per context
- **Context-Aware Normalization**: Order normalization runs independently per context

## Real-time Updates

- **SWR Integration**: Optimistic updates with automatic revalidation
- **GraphQL Subscriptions**: Real-time updates across clients
- **Conflict Resolution**: Order normalization handles concurrent updates

## Performance Considerations

- **Insertion-Based Ordering**: Uses midpoint calculation to minimize database updates
- **Debounced Normalization**: 1-minute delay prevents excessive normalization
- **Context Scoping**: Limits operations to relevant subset of projects
- **Optimistic UI**: Immediate feedback while background sync occurs

## Security & Authorization

- **Owner-Based Access**: All project operations scoped to authenticated user
- **Context Validation**: Ensures users can only modify their own projects
- **Field-Level Security**: Order field follows same authorization as other project fields
