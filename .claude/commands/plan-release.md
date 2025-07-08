# Generate a Release Design Document

This workflow guides you through creating a Release Design Document in markdown format and storing it in the `docs/release-planning` folder. You’ll use tools and bash commands to automate parts of the process, with user interaction where needed.

## Step 1: Understand the User's Requirements

If the user has not provided their `requirements`, ask the user to provide them. Ask follow-up questions once to create more clarity about the user's requirements for the release. Note the user's requirements in `requirements`.

## Step 2: Define Release Name

If applicable, read all documents in `docs/app-design/` and the `CLAUDE.md` to understand the purpose of the product we plan to create a new release for.
Based on the `requirements` determine the `release_name`. Note `docs/release-planning/{release_name}` as `design_folder`. Note `{design_folder}/release-design-document.md` as `design_file_name`. Create the file `{design_file_name}` and add the title `# Release Design Document: {release_name}`.

## Step 3: Define the Details for the Design

Read the file `./claude/examples/release-design.md` and note its content in `design_example`.

Create a detailed specification following the **Design Document Structure** and append it to `design_file_name`:

### Design Document Structure

Using the file in `design_example` as a quality benchmark, fill in every placeholder of the skeleton you are about to append.

Match:
• Section depth
• Bullet granularity
• Tone and length of prose

```md
## Overview

{Give a high-level overview about the release and its purpose}

## Key Feature Additions

{list all features}

### 1. {title of first and most important feature}

### 2. {title of second most important feature}

### ...
```

## Step 4: User Review Of Design Document

Ask the user to review and adjust the Design Document according to their needs. The user can either edit the document itself or ask the chat bot to do changes. Continue only when the user confirmed, that the Design Document appropriately represents what the user expects from the release.

<wait_for_user_response var="design_confirmed" />

<if var="design_confirmed" equals="CONFIRM">
  <log>✅ Design document approved by user</log>
</if>

## Step 5: Create a Tech Stack

Read the file `.claude/preferences/tech-stack.md` and note its content in `preferences_tech_stack`.

Read the file `docs/app-design/tech-stack.md`. Note in `existing_tech_stack`.
Based on the file `design_file_name` and the `existing_tech_stack` validate missing tech stack components that need to be defined for this release. It should be the simplest yet most robust tech stack to implement the solution. Consider `preferences_tech_stack` where it makes sense. Make sure you consider frontend and backend technologies. Note the `tech_stack`.

## Step 6: Ask for User Confirmation for the Tech Stack

List just the technologies considered in the `tech_stack` and ask the user for confirmation or requests for adjustments. Adjust `tech_stack` until the user confirms they are happy with the stack.

<wait_for_user_response var="tech_stack_confirmed" />

<if var="tech_stack_confirmed" equals="CONFIRM">
  <log>✅ Tech Stack approved by user</log>
</if>

## Step 7: Document the Tech Stack

Read the file `.claude/examples/tech-stack.md` and note its content in `example_tech_stack`.

Based on `tech_stack` create a file `{design_folder}/tech-stack.md` and add the title `# {release_name} Tech Stack`. The Tech Stack should follow the document structure described in **Tech Stack Document Structure**.

### Tech Stack Document Structure

Use `example_tech_stack` as a quality benchmark.

Match:
• Section depth
• Bullet granularity
• Tone and length of prose

```md
## Key Architectural Patterns

{list the key architectural patterns and describe each in one paragraph}

## Technology Selection Principles

{describe the key principles for selecting the technologies and frameworks}

## Frontend

{list the frontend technologies and frameworks; for each technology and framework describe briefly how they meet the architectural patterns and the key selection principles}

## Backend

{list the backend technologies and frameworks; for each technology and framework describe briefly how they meet the architectural patterns and the key selection principles}

## Development and Operations

{list the technologies and frameworks for the development environment and for the operations; for each technology and framework describe briefly how they meet the architectural patterns and the key selection principles}
```

## Step 8: User Review Of Tech Stack Document

Ask the user for confirmation or requests for adjustments on the tech stack document. Adjust the file until the user confirms they are happy with the stack.

<wait_for_user_response var="stack_doc_confirmed" />

<if var="stack_doc_confirmed" equals="CONFIRM">
  <log>✅ Tech Stack doc approved by user</log>
</if>

## Step 9: Create An Implementation Plan

Read all files in `docs/app-design/`, all files in `{design_folder}/`, and the `CLAUDE.md`. Note as `full_design`.
Note `{design_folder}/implementation-plan.md` as `plan_file_name`.

### Generate The Implementation Plan

Based on `full_design`, create a concise implementation plan (in markdown) which provides step-by-step instructions for AI developers. Each step should group related functionality together and be substantial enough to implement a complete feature or logical component. Steps should focus on implementation details without separate testing phases (as engineers will not write separate test code). It should not include any code, just clear instructions.

Guidelines for step consolidation:

- Group related API changes, component modifications, and integrations into single comprehensive steps
- Combine frontend and backend changes that work together for the same feature
- Merge similar operations across different components into unified steps
- Avoid granular steps that only modify single properties or small code sections
- Do not include separate testing steps - testing guidance should be integrated within implementation steps
- Each step should deliver a working, meaningful piece of functionality

For example, instead of separate steps for "add prop to component A", "add prop to component B", "implement logic in component A", "implement logic in component B", create one step: "Implement optional control feature across all relevant components including prop addition and logic implementation".

Document the implementation plan in `plan_file_name`.
