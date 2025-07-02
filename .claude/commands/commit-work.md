# Commit The Current Work

This workflow stages every modified file, drafts a **Conventional Commits** message, lets you approve or tweak it, and then commits (and optionally pushes) the result.

## Step 1 – Stage all changed files

```bash
git add -A
```

## Step 2 – Generate a Conventional Commit message

1. Show the staged diff:

   ```bash
   git --no-pager diff --cached
   ```

2. Read that diff and decide on the correct **type**
   (`feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`,
   `build`, `ci`, `chore`, `revert`).
   If the change is breaking, append **`!`** right after the type.

3. Compose the message in this exact format
   _(max 72 chars in the subject line)_

   ```text
   <type>[optional(scope)][!]: <imperative summary>

   [optional body – wrap at 100 chars per line]

   [optional footer(s) such as BREAKING CHANGE:, Closes #123]
   ```

   Ignore references to an implementation plan or which step of that plan has been finished.

4. Store the full message as **\$COMMIT_MSG**.

5. Confirm with the user:

   ```xml
   <ask_followup_question>
   <question>Here's the commit message I drafted:

   $COMMIT_MSG

   Use this?</question>
   <options>["Yes, commit it", "Regenerate", "I'll edit it myself"]</options>
   </ask_followup_question>
   ```

   - If **Regenerate** → repeat Step 2.
   - If **I'll edit it myself** → open an editor pre-filled with
     **\$COMMIT_MSG**, wait for save, then continue.

## Step 3 – Commit

```bash
git commit -m "$COMMIT_MSG"
```
