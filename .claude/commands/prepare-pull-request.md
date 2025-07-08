# Prepare Release

This workflow prepares a new release by analyzing commits, updating version numbers, consolidating release documentation, and creating a comprehensive release changelog.

## Step 1 – Determine current version

Note the current version from `./VERSION` in `current_version`.

```bash
echo "Current version: $current_version"
```

## Step 2 – Get commits since last version

Retrieve all commit messages since the last tagged version:

```bash
git log v$current_version..HEAD --oneline --pretty=format:"%s"
```

Store the commit list for analysis in the next step.

## Step 3 – Determine next version based on semantic versioning

Analyze the commit messages from Step 2 to determine the version bump:

- **BREAKING CHANGE** or commits with `!` → **MAJOR** version bump
- **feat:** commits → **MINOR** version bump
- **fix:** commits → **PATCH** version bump
- Other commit types (docs, chore, etc.) → **PATCH** version bump

Based on analysis, determine `NEW_VERSION`.
For example: if current_version=1.2.3 and there are feat commits:
NEW_VERSION=1.3.0

## Step 4 – Update version numbers

Update the version numbers in the `./VERSION` script with the new version.

## Step 5 – Locate release planning documentation

Search for `progress.md` in the `docs/release-planning` directory:

```bash
find docs/release-planning -name "progress.md" -type f
```

Extract and store the folder name containing `progress.md`:

```bash
RELEASE_FOLDER=$(dirname $(find docs/release-planning -name "progress.md" -type f))
echo "Release folder: $RELEASE_FOLDER"
```

## Step 6 – Extract release information

Read the `progress.md` file and derive:

- **Release Name**: Extract from the document title or main heading
- **Release Description**: Summarize the key points and objectives

```bash
cat "$RELEASE_FOLDER/progress.md"
```

Analyze the content to determine appropriate **RELEASE_NAME** and **RELEASE_DESCRIPTION**.

## Step 7 – Create release documentation

Create the release changelog using the template from `.claude/templates/release-change-log.md` and create a file `docs/releases/v$NEW_VERSION.md`.

Update the template placeholders:

- Replace `:RELEASE_NAME` with the derived release name
- Replace `:VERSION` with `$NEW_VERSION`
- Fill in the content sections based on:
  - Commit analysis from Step 2
  - Release information from Step 6

## Step 8 – Clean up release folder

Remove the release planning folder:

```bash
rm -rf "$RELEASE_FOLDER"
```

## Step 9 – Review all changes

Show a comprehensive diff of all modifications:

```bash
git add -A
git diff --cached
```

Display a summary of changes:

- Version number updates
- New release documentation
- Tech stack changes (if any)
- Removed release planning folder

## Step 10 – Confirm changes with user

```xml
<ask_followup_question>
<question>Review the changes above for release v$NEW_VERSION. The following will be included:

- Updated ./VERSION to v$NEW_VERSION
- Created docs/releases/v$NEW_VERSION.md with release documentation
- Updated tech stack documentation (if applicable)
- Removed release planning folder: $RELEASE_FOLDER

Proceed with the release preparation?</question>
<options>["Yes, proceed with release", "No, I need to make changes", "Cancel release preparation"]</options>
</ask_followup_question>
```

If **No, I need to make changes** → pause workflow for user modifications.
If **Cancel release preparation** → abort and reset any staged changes.

## Step 11 – Commit release preparation

Create a commit with all the release preparation changes:

```bash
git commit -m "chore: prepare release of v$NEW_VERSION"
```

## Step 12 – Push changes

Push the release preparation commit to the current branch:

```bash
git push
```

## Step 13 – Validate GitHub integration

Check if there's an available MCP server or tool to communicate with GitHub:

```xml
<use_mcp_tool>
<tool_name>list_tools</tool_name>
</use_mcp_tool>
```

Look for GitHub-related MCP tools (e.g., `github.com/modelcontextprotocol/servers/tree/main/src/github`).

If no GitHub MCP integration is available:

```xml
<ask_followup_question>
<question>No GitHub MCP integration found. This workflow requires GitHub API access to create pull requests. Please configure a GitHub MCP server or create the pull request manually.</question>
<options>["I'll configure GitHub MCP", "I'll create PR manually", "Skip PR creation"]</options>
</ask_followup_question>
```

If **I'll configure GitHub MCP** or **I'll create PR manually** → pause workflow.
If **Skip PR creation** → workflow ends here.

## Step 14 – Check for existing pull request

Get the current branch name and check for existing pull requests:

```bash
CURRENT_BRANCH=$(git branch --show-current)
echo "Current branch: $CURRENT_BRANCH"
```

Use the GitHub MCP tool to check for existing pull requests from this branch:

```xml
<use_mcp_tool>
<server_name>github.com/modelcontextprotocol/servers/tree/main/src/github</server_name>
<tool_name>list_pull_requests</tool_name>
<arguments>
{
  "owner": "REPOSITORY_OWNER",
  "repo": "REPOSITORY_NAME",
  "head": "CURRENT_BRANCH",
  "state": "open"
}
</arguments>
</use_mcp_tool>
```

If no existing pull request is found, create a new one in the next step.
If a pull request already exists, update it in Step 15.

## Step 15 – Create or update pull request

Extract the title and description from the release changelog file:

```bash
# Extract release name (title) and description from docs/releases/v$NEW_VERSION.md
RELEASE_TITLE=$(head -1 "docs/releases/v$NEW_VERSION.md" | sed 's/^# //')
RELEASE_DESCRIPTION=$(sed -n '/## Neue Funktionen und Änderungen/,/## Detaillierte Änderungen/p' "docs/releases/v$NEW_VERSION.md" | head -n -1 | tail -n +2)
```

If no existing pull request was found in Step 14, create a new pull request:

```xml
<use_mcp_tool>
<server_name>github.com/modelcontextprotocol/servers/tree/main/src/github</server_name>
<tool_name>create_pull_request</tool_name>
<arguments>
{
  "owner": "REPOSITORY_OWNER",
  "repo": "REPOSITORY_NAME",
  "title": "$RELEASE_TITLE",
  "body": "$RELEASE_DESCRIPTION",
  "head": "$CURRENT_BRANCH",
  "base": "main"
}
</arguments>
</use_mcp_tool>
```

If a pull request already exists, update its title and description using the appropriate GitHub MCP update tool.

The release is now fully prepared with:

- Version bumped and committed
- Release documentation created
- Pull request created/updated with proper title and description
- Ready for review and merge
