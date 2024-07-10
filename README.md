[![Release Workflow](https://github.com/cabcookie/personal-crm/actions/workflows/release.yml/badge.svg?branch=main)](https://github.com/cabcookie/personal-crm/actions/workflows/release.yml)

# Personal CRM

## Description

With Personal CRM you can cover your work and family life as well as your hobbies. Get control over your life and get things done.

## Setup Instructions

### Environment Configuration (WIP)

In sandbox environments you can create seed data with `node scripts/start-import.js --environment [ENVIRONMENT-NAME] --email info@example.com`.
To run the script, you need to provide environment-specific configuration details. This information should be stored in a `env.json` file located in the `scripts` directory.

1. Create a file named `env.json` in the `scripts` directory.
2. Add the following content to the `env.json` file, replacing the placeholders with your actual values:

   ```json
   {
     "staging": {
       "tables": "your-environment-id",
       "userPoolId": "your-user-pool-id",
       "profile": "the-aws-profile-from-your-config",
       "region": "your-aws-region"
     },
     "prod": {
       "tables": "your-environment-id",
       "userPoolId": "your-user-pool-id",
       "profile": "the-aws-profile-from-your-config",
       "region": "your-aws-region"
     },
     "dev": {
       "tables": "your-environment-id",
       "userPoolId": "your-user-pool-id",
       "profile": "the-aws-profile-from-your-config",
       "region": "your-aws-region"
     }
   }
   ```

When you create an Amplify Sandbox it returns a list of resources that has been created. Watch out for these lines in the output:

```bash
amplify-personalcrm-xxxx.awsAppsyncApiId = `your-environment-id`
amplify-personalcrm-xxxx.userPoolId = `your-user-pool-id`
```
