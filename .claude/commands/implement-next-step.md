# Implement Next Step from Implementation Plan

This workflow guides you through implementing the next step from the implementation plan, tracking progress, and updating the file structure. You’ll use Claude’s tools and bash commands to automate parts of the process, with user interaction where needed.

## Step 1: Validate Product or Release

Validate if a file `docs/release-planning/{sub_folder}/implementation-plan.md` exists.

### Option 1: File Exists

Note `docs/release-planning/{sub_folder}` as `design_folder`.

### Option 2: File Does Not Exist

Note `docs/app-design` as `design_folder`.

## Step 2: Gather Documentation

Read all files in the folder `design_folder` to understand the desired product, the implementation plan, and the current state of the project.

## Step 3: Determine the Next Step

Read the file `{design_folder}/implementation-plan.md` to understand all the steps that need to be implemented. Read the file `{design_folder}/progress.md` and validate all steps that have been implemented already. Based on the documentation, determine which is the step from the implementation plan that needs to be implemented next. If `{design_folder}/progress.md` doesn't exist, the first step of the implementation plan is the next step.
Note in `next_step`.

## Step 4: Confirm Step with User

Ask the user to confirm `next_step` should be the next one. Describe what this step entails.

<wait_for_user_response var="step_number" />
<log>✅ {step_number} will be implemented</log>

## Step 5: Implement the Step

Implement `Step [step_number]` as outlined in `{design_folder}/implementation-plan.md`. Use Claude’s tools to make the necessary changes.

- Refer to `{design_folder}/implementation-plan.md` for the specific actions needed for `Step [step_number]`.
- After implementing, test the changes to ensure they work as expected.

## Step 6: Validate with User

Describe for the user what changes have been implemented and how the user can test a successful implementation. Ask the user to confirm, that the implementation has been successful. The user might highlight issues or might have questions on the implementation. Fix issues or implement changes based on the user's feedback. After the changes have been applied ask the user again if the features are working as expected. Repeat until the user confirms the successful implementation, then move on to Step 7 of this workflow.

<wait_for_user_response var="implementation_confirmed" />

<if var="implementation_confirmed" equals="CONFIRM">
  <log>✅ User confirmed implementation of step {step_number} is completed</log>
</if>

## Step 7: Document Completion

Retrieve system date. Note in `completed_on` in the format `YYYY-MM-DD`.

After validation, update the documentation:

- Document what you have done in `{design_folder}/progress.md`:
  - Add a new completed step entry with format: `## ✅ Step [step_number]: [Step Title] (Completed: {completed_on})`
  - Include detailed documentation of what was implemented, files modified, and verification results
  - Do NOT add section headers like "**Completed Steps**" or "**Remaining Steps**"
  - Do NOT document remaining or future steps - only document what has been completed
  - Focus on providing clear, actionable documentation of the completed work
