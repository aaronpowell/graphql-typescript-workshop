# Step 1 - Setup

Let's start building our application!

In this module we're going to setup the basics of our TypeScript React application with a GraphQL backend. To speed things up, we already have a few things already installed, the starting point for our React app, and the skeleton for an API. Refer below to learn how they were setup.

Now it's time to add GraphQL to the project, we're going to use [Apollo](https://www.apollographql.com/)'s GraphQL server, as it will easily integrate with [Azure Functions](https://www.apollographql.com/docs/apollo-server/deployment/azure-functions/) to give us a serverless GraphQL backend.

## 1. Install the dependencies

From the terminal, we'll install the dependencies that we're going to need for GraphQL, into the `api` project. Start by navigating there.

```bash
$> cd api
```

Next, install the dependencies required:

```bash
$> npm install apollo-server-azure-functions graphql --save
```

## 2. Create our GraphQL endpoint

We'll add a new Function to Azure Functions for our GraphQL endpoint:

```bash
$> npx func new --template "Http Trigger" --name graphql
```

_You can delete the `get-message` folder if you wish, we won't need it._

## 3. Implement a basic GraphQL backend

With our GraphQL Function created, it's time to implement a basic endpoint. Start by opening `graphql/function.json` and replace it with the following:

```json
{
  "bindings": [
    {
      "authLevel": "function",
      "type": "httpTrigger",
      "direction": "in",
      "name": "req",
      "methods": ["get", "post"]
    },
    {
      "type": "http",
      "direction": "out",
      "name": "$return"
    }
  ],
  "scriptFile": "../dist/graphql/index.js"
}
```

We've changed how the Function outputs the HTTP response to not use a variable, but instead use `$return`, meaning when the Function returns.

It's now time to create a GraphQL endpoint. Open up `graphql/index.ts` and update it with the following:

```typescript
import { ApolloServer, gql } from 'apollo-server-azure-functions';

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Query {
    hello: String
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => 'Hello from our GraphQL backend!',
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

export default server.createHandler();
```

## 4. Test our server

It's now time to test our server. Run the Functions app (see below) and navigate to http://localhost:7071/api/graphql. You'll be presented with the [GraphQL Playground](https://www.apollographql.com/docs/apollo-server/testing/graphql-playground/) in which you can run our query:

```graphql
query {
    hello
}
```

And you'll see an output with the message created.

## Running The Application

From a terminal run `npm start` from both the repository root and `api` folder to start the two servers, the web application will be on `http://localhost:3000` and the API on `http://localhost:7071`. Alternatively, you can use the VS Code launch of `Run full stack` to run both together with debuggers attached.

## How the skeleton was created

This folder already has some files in it, to save you running a few more tools. First a React app was created using [`create-react-app`](https://create-react-app.dev) with [TypeScript support](https://create-react-app.dev/docs/adding-typescript/)

```bash
$> npx create-react-app my-app --template typescript
```

Next, a basic [Azure Function](https://docs.microsoft.com/azure/azure-functions?WT.mc_id=javascript-13112-aapowell) app was created using the [cli tool](https://docs.microsoft.com/azure/azure-functions/functions-run-local?WT.mc_id=javascript-13112-aapowell&tabs=windows%2Ccsharp%2Cbash#v2):

```bash
$> mkdir api
$> npm init -y
$> npm install -D azure-function-core-tools@3
$> npx func init --worker-runtime node --language typescript
```
