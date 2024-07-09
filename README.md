[![Release Workflow](https://github.com/cabcookie/personal-crm/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/cabcookie/personal-crm/actions/workflows/release.yml)

# Personal CRM

## Description

With Personal CRM you can cover your work and family life as well as your hobbies. Get control over your life and get things done.

## Setup Instructions

### Environment Configuration (WIP)

In sandbox environments you can create seed data with `npm run create-seed`.
To run the script, you need to provide environment-specific configuration details. This information should be stored in a `env.json` file located in the `scripts/seed-data` directory.

1. Create a file named `env.json` in the `scripts/seed-data` directory.
2. Add the following content to the `env.json` file, replacing the placeholders with your actual values:

   ```json
   {
     "environmentId": "your-environment-id",
     "userPoolId": "your-user-pool-id",
     "userEmail": "example@example.com"
   }
   ```

When you create an Amplify Sandbox it returns a list of resources that has been created. Watch out for these lines in the output:

```bash
amplify-personalcrm-xxxx.awsAppsyncApiId = `your-environment-id`
amplify-personalcrm-xxxx.userPoolId = `your-user-pool-id`
```
