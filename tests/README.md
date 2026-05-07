# Router Tests

Focused tests for embeddings and related cloud routing behavior.

## Setup

From the repository root:

```bash
cd tests
npm install
```

## Run tests

```bash
npm test
```

If your environment expects a custom `NODE_PATH`, keep using the path configured for your local machine.

## Current test coverage

- `unit/embeddingsCore.test.js`
- `unit/embeddings.cloud.test.js`

These cover request validation, provider routing, error propagation, retry behavior, auth checks, and cloud handler edge cases.
