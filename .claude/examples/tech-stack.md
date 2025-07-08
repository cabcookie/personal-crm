# Note-Taking Application Tech Stack

This document summarizes the key architectural decisions for our note-taking application.

## Key Architectural Patterns

### Real-time Collaboration

The application implements collaborative editing using Yjs, a CRDT-based library that integrates with the Tiptap editor through the `y-prosemirror` binding. A custom WebSocket server hosted on AWS handles the synchronization of changes between users in real-time.

### Document State Persistence

A debounced writing strategy persists document state to the database after 5 seconds of inactivity, with a maximum wait time of 30 seconds during continuous editing. Both the full Y.Doc state and incremental updates are stored to ensure data integrity and support features like version history.

### API Architecture

GraphQL (via AWS AppSync) serves as the primary API architecture, enabling efficient data fetching with precise queries and providing real-time capabilities through GraphQL subscriptions. This complements the Yjs WebSocket solution for in-document collaboration while handling broader app data and notifications.

### Authentication & Authorization

AWS Cognito provides user authentication with support for email/password and social logins. Authorization is managed through a combination of Cognito's identity pools for IAM-based roles and application-specific permission logic stored in DynamoDB.

### Offline-First Approach

The application is designed with an offline-first mindset, storing data locally in IndexedDB and implementing synchronization mechanisms to reconcile changes when connectivity is restored. This approach ensures users can continue working regardless of their connection status.

### State Management

React Context with Hooks manages the application's state, providing a simple yet effective solution for real-time updates, UI state, and temporary data storage. This approach integrates well with React's ecosystem and supports the application's offline and real-time capabilities.

## Technology Selection Principles

Throughout the architectural decisions, several key principles guided technology selection:

1. **AWS Ecosystem Integration**: Preference for AWS services to maintain consistent infrastructure and data privacy
2. **Developer Experience**: Technologies that leverage the team's existing expertise (React/Next.js) and provide clear development patterns
3. **Offline Capability**: Solutions that support offline-first functionality for enhanced user experience
4. **Performance**: Focus on technologies that deliver fast load times and responsive interactions
5. **Scalability**: Architecture designed to handle increasing complexity and growing user base

This tech stack provides a robust foundation for building a feature-rich, collaborative note-taking application with strong offline capabilities and real-time collaboration features.

## Frontend

### Framework: Next.js (v15)

Next.js (version 15) is selected as the frontend framework because it aligns closely with the app’s requirements and the team’s preferences. The file-based routing system satisfies the desire for an intuitive navigation structure, where routes are easily understood by examining the file system—a feature explicitly valued by the team lead. The API routes provide a streamlined way to handle server-side logic and integrate with backend APIs, matching the preference for this capability. Next.js builds on the team’s React expertise, enhancing developer productivity, while its performance optimizations (e.g., SSR, SSG) ensure a fast and scalable app. Although other frameworks like React with React Router offer flexibility, they lack the built-in features and simplicity of Next.js. Vue.js with Nuxt.js and SvelteKit, while capable, do not leverage the team’s existing skills as effectively. Thus, Next.js strikes the best balance of familiarity, functionality, and future-proofing for the note-taking app.

### Editor: TipTap

Tiptap was selected because it strikes an optimal balance between **ease of use** and **robustness** for the note-taking app’s requirements. Its simpler API and pre-built components allow for rapid development of essential features like markdown support and media embedding, while its ProseMirror foundation ensures extensibility for custom needs (e.g., tags and LLM-driven functionality). Tiptap’s client-side nature supports offline use out of the box, and its integration with Next.js is straightforward. Although ProseMirror offers more raw power and Slate provides strong flexibility, Tiptap’s combination of simplicity, sufficient customization, and good documentation makes it the most practical choice for this project. If future needs exceed Tiptap’s capabilities, we can leverage ProseMirror’s underlying API directly.

This decision aligns with the project’s goals of efficient development, feature support, and a local-first approach, ensuring a solid foundation for the editor.

## Backend

### Cloud Provider: AWS

AWS was chosen as the foundational cloud provider due to its extensive range of services that can address the note-taking app’s requirements. AWS offers multiple options for authentication, storage, APIs, real-time communication, and scalability, providing flexibility to meet both current and future needs. Within this ecosystem, **AWS Amplify** stands out as the optimal backend environment because it simplifies the integration of these capabilities into a cohesive solution.

Amplify streamlines the development process by offering pre-built support for critical features like authentication, authorization, storage, GraphQL APIs, and WebSocket services. This reduces the complexity of manually configuring individual AWS components while ensuring compatibility with the Next.js and Tiptap frontend. Its developer-friendly tools and seamless AWS integration enable rapid prototyping and deployment, aligning with the project’s goals of efficiency and scalability.

While a custom AWS solution provides greater control, it demands significantly more setup and maintenance effort. Firebase, though feature-rich, was excluded as it operates outside AWS, conflicting with the preference for AWS-based data control. Amplify’s trade-offs—such as its abstraction layer and AWS dependency—are outweighed by its ability to deliver a robust, scalable backend with minimal overhead.

This decision establishes AWS Amplify as the backend environment, leveraging AWS’s versatile infrastructure to support the note-taking app’s requirements effectively.

## Development & Operations

### Testing: Jest, React Testing Library, Cypress

The selected frameworks and methodologies provide a balanced and effective testing strategy:

- **Jest with React Testing Library**: Jest is a widely adopted testing framework for React applications, offering fast and reliable unit tests. Paired with React Testing Library, it ensures components meet user expectations, aligning with the app’s emphasis on a quality UI.
- **Integration Testing Approach**: Jest handles backend and API tests efficiently, while React Testing Library verifies frontend-backend interactions, ensuring seamless data flow.
- **Cypress for E2E Testing**: Cypress is well-suited for simulating real-world user scenarios, such as offline note creation and real-time collaboration via WebSockets. Its ability to mock network conditions and handle asynchronous behavior makes it ideal for the app’s needs.
- **CI Pipeline**: Automating tests in CI ensures consistent quality checks and reduces manual overhead.

This combination balances thoroughness with practicality, leveraging the team’s familiarity with these tools to maintain a high standard of code quality and user experience.
