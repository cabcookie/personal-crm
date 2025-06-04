# AWS Amplify Gen2 Development Guidelines

This project leverages **AWS Amplify Gen2** solutions for full-stack web development with Next.js. Amplify Gen2 provides a modern, type-safe approach to building cloud-powered applications with fullstack TypeScript support and built on AWS CDK.

## Project Architecture

This personal CRM application uses AWS Amplify Gen2 for:

- **Authentication**: Amazon Cognito-powered user management
- **Data**: Real-time GraphQL API with DynamoDB backend
- **Storage**: Amazon S3 file storage with fine-grained access controls
- **Functions**: AWS Lambda serverless functions for custom business logic

## Authentication Setup

Authentication in this project is powered by Amazon Cognito through Amplify Auth. The auth resource is configured in `amplify/auth/resource.ts`.

### Basic Auth Configuration

```typescript
import { defineAuth } from "@aws-amplify/backend";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
});
```

### Key Points

- Email-based authentication is the default login mechanism
- Additional providers (phone, Google, Facebook, Amazon, Apple) can be configured
- Auth resource must be deployed with `npx ampx sandbox`
- Configuration is automatically exported to `amplify_outputs.json`

### Frontend Integration

```typescript
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);
```

## Data Setup

Amplify Data provides a real-time GraphQL API backed by DynamoDB. The data schema is defined in TypeScript in `amplify/data/resource.ts`.

### Basic Data Configuration

```typescript
import { a, defineData, type ClientSchema } from "@aws-amplify/backend";

const schema = a.schema({
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean(),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: { expiresInDays: 30 },
  },
});
```

### Features

- **Auto-generated Resources**: Each `a.model()` creates DynamoDB table, CRUD APIs, and real-time subscriptions
- **Type Safety**: Full TypeScript support with generated client types
- **Real-time Updates**: Built-in subscription support via `observeQuery()`
- **Authorization**: Fine-grained access control rules

### Frontend Usage

```typescript
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

// Create
await client.models.Todo.create({
  content: "New todo",
  isDone: false,
});

// Read with real-time updates
const sub = client.models.Todo.observeQuery().subscribe({
  next: ({ items }) => setTodos([...items]),
});
```

## Storage Setup (Amazon S3)

Amplify Storage provides seamless file management backed by Amazon S3. Storage configuration is defined in `amplify/storage/resource.ts`.

### Basic Storage Configuration

```typescript
import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplifyTeamDrive",
  access: (allow) => ({
    "profile-pictures/{entity_id}/*": [
      allow.guest.to(["read"]),
      allow.entity("identity").to(["read", "write", "delete"]),
    ],
    "picture-submissions/*": [
      allow.authenticated.to(["read", "write"]),
      allow.guest.to(["read", "write"]),
    ],
  }),
});
```

### Key Features

- **Path-based Access Control**: Fine-grained permissions per file path
- **Multiple Buckets**: Support for multiple S3 buckets with unique names
- **Identity-based Paths**: Dynamic paths using user identity (`{entity_id}`)
- **Guest vs Authenticated**: Different access levels for different user types

### Frontend Usage

```typescript
import { uploadData, downloadData } from "aws-amplify/storage";

// Upload file
await uploadData({
  data: fileData,
  path: `picture-submissions/${fileName}`,
});

// Download file
const result = downloadData({
  path: "album/2024/1.jpg",
}).result;
```

### Multiple Buckets

```typescript
// Define multiple buckets
export const firstBucket = defineStorage({
  name: "firstBucket",
  isDefault: true,
});

export const secondBucket = defineStorage({
  name: "secondBucket",
});

// Use specific bucket
await downloadData({
  path: "album/2024/1.jpg",
  options: {
    bucket: "secondBucket",
  },
});
```

## Functions Setup (AWS Lambda)

Amplify Functions enable custom serverless logic using AWS Lambda. Functions are defined in `amplify/functions/[function-name]/resource.ts`.

### Basic Function Configuration

```typescript
import { defineFunction } from "@aws-amplify/backend";

export const sayHello = defineFunction({
  name: "say-hello",
  entry: "./handler.ts",
});
```

### Handler Implementation

```typescript
// amplify/functions/say-hello/handler.ts
import type { Handler } from "aws-lambda";

export const handler: Handler = async (event, context) => {
  return "Hello, World!";
};
```

### Integration with Data (Recommended)

Functions work best when integrated with the Data layer for type safety:

```typescript
// In amplify/data/resource.ts
const schema = a.schema({
  sayHello: a
    .query()
    .arguments({
      name: a.string(),
    })
    .returns(a.string())
    .authorization((allow) => [allow.guest()])
    .handler(a.handler.function(sayHello)),
});

// Type-safe handler
import type { Schema } from "../../data/resource";

export const handler: Schema["sayHello"]["functionHandler"] = async (event) => {
  const { name } = event.arguments;
  return `Hello, ${name}!`;
};
```

### Frontend Usage

```typescript
const client = generateClient<Schema>();

const result = await client.queries.sayHello({
  name: "Amplify",
});
```

## Development Workflow

### 1. Local Development

```bash
# Start local sandbox environment
npx ampx sandbox

# This command:
# - Deploys resources to your personal cloud sandbox
# - Generates amplify_outputs.json with connection details
# - Watches for changes and hot-reloads
```

### 2. Backend Updates

```bash
# Add backend resource to amplify/backend.ts
import { defineBackend } from '@aws-amplify/backend';
import { auth } from './auth/resource';
import { data } from './data/resource';
import { storage } from './storage/resource';
import { sayHello } from './functions/say-hello/resource';

defineBackend({
  auth,
  data,
  storage,
  sayHello
});
```

### 3. Frontend Configuration

```typescript
// Configure Amplify in your app's entry point
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";

Amplify.configure(outputs);
```

## Project-Specific Schemas

This project uses multiple data schemas organized by domain:

- `amplify/data/account-schema.ts` - Account/customer management
- `amplify/data/activity-schema.ts` - Activity tracking
- `amplify/data/person-schema.ts` - Person/contact management
- `amplify/data/project-schema.ts` - Project management
- `amplify/data/analytics-schema.ts` - Analytics and reporting
- `amplify/data/bible-schema.ts` - Bible/spiritual content
- `amplify/data/planning-schema.ts` - Planning and scheduling
- `amplify/data/prayer-schema.ts` - Prayer management

## Best Practices

### 1. Type Safety

- Always use the generated `Schema` type for client operations
- Import types from `amplify/data/resource` for function handlers
- Use `ClientSchema<typeof schema>` for frontend type definitions

### 2. Authorization

- Define explicit authorization rules for all models and storage paths
- Use appropriate access patterns (`guest`, `authenticated`, `entity('identity')`)
- Test authorization rules thoroughly in sandbox environment

### 3. Real-time Updates

- Prefer `observeQuery()` over manual polling for real-time data
- Unsubscribe from subscriptions to prevent memory leaks
- Handle connection states appropriately

### 4. File Storage

- Use descriptive path patterns for file organization
- Implement proper access controls based on user context
- Consider file size limits and optimization

### 5. Functions

- Keep functions focused and single-purpose
- Use environment variables for configuration
- Integrate with Data layer for type safety
- Handle errors gracefully

## Deployment

### Development

```bash
npx ampx sandbox  # Personal cloud sandbox
```

### Production

The project uses Amplify's CI/CD pipeline. Commits to the main branch trigger automatic deployments.

```bash
git add .
git commit -m "Add new feature"
git push origin main  # Triggers deployment
```

## Environment Management

- **Sandbox**: Personal development environment (`npx ampx sandbox`)
- **Production**: Managed through Amplify Console CI/CD
- **Configuration**: Environment-specific settings in `amplify_outputs.json`

## Monitoring and Debugging

- Use AWS CloudWatch for function logs
- Monitor API performance through AppSync console
- Use Amplify Console for deployment status and logs
- Test authorization rules in sandbox before production deployment
