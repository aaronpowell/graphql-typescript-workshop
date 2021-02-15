# Step 8 - React Application

Up until now we've been focusing on the GraphQL Server component and it's all ready to go, we can create games, add players to it, start it and answer questions and then query the data back out. What we don't yet have is a client to do that for us, so it's time to start building one and we'll look at using React.

We already have the starting of a React app written in TypeScript within the `src` folder (see [App Setup](#App-Setup) for info on what was setup in advance), but now it's time to take it and have it work with our GraphQL server.

## 1. Creating a game

The game is going to have four pages to it, `CreateGame`, `JoinGame`, `PlayGame` and `CompleteGame`, that represent the flow a player will take through it. We'll start by implementing the `CreateGame` page, which is going to need to call the mutation we wrote in the last module:

```graphql
mutation {
  createGame {
    id
  }
}
```

Apollo's GraphQL client for React provides us with a [`useMutation` hook](https://www.apollographql.com/docs/react/data/mutations/#executing-a-mutation) that we can provide a GraphQL string to using the `gql` function (from `@apollo/client`). Now our `CreateGame.tsx` would look like this:

```typescript
import React from "react";
import { gql, useMutation } from "@apollo/client";

const createGameDocument = gql`
  mutation {
    createGame {
      id
    }
  }
`;

const CreateGame: React.FC = () => {
  const [createGame] = useMutation(createGameDocument);

  return (
    <div>
      <h1>Create a new game!</h1>
      <button onClick={() => createGame()}>Start</button>
    </div>
  );
};

export default CreateGame;
```

Unfortunately though, we've lost our type-safety. We don't know what arguments are needed by the mutation, what their types are or what is returned from the mutation.

## 2. Adding type-safety to the client

The code generator we introduced has a plugin that we can use to generate integration with Apollo, [`@graphql-codegen/typescript-react-apollo`](https://graphql-code-generator.com/docs/plugins/typescript-react-apollo). To use this, we'll create a series of operations that will tell the code generator how we _expect_ a client to consume the GraphQL server. Since we already have the code generator installed, we'll use that config file and avoid duplicating the dependencies, so let's install the plugin.

```bash
$> cd api
$> npm install --save-dev @graphql-codegen/typescript-react-apollo
```

Next, we'll open `api/config.yml`, add a location for the operations and an output target:

```yaml
overwrite: true
schema: "./graphql/schema.graphql"
documents: "../src/operations/*.graphql"
generates:
  graphql/generated.ts:
    config:
      contextType: "./apolloContext#ApolloContext"
      mappers:
        Question: ./data/types#QuestionModel
        Game: ./data/types#GameModel
        Player: ./data/types#UserModel
    plugins:
      - "typescript"
      - "typescript-resolvers"

  ./graphql.schema.json:
    plugins:
      - "introspection"

  ../src/generated.tsx:
    config:
      withHooks: true
      withHOC: false
      withComponent: false
    plugins:
      - "typescript"
      - "typescript-react-apollo"
      - "typescript-operations"
hooks:
  afterAllFileWrite:
    - npx prettier --write
```

The new section will result in a file output to `src/generated.tsx` and it will look for operation files in `src/operations` of `.graphql` extension. Let's start with the `createGame` mutation, and create a file at `src/operations/createGame.graphql`:

```graphql
mutation CreateGame {
  createGame {
    id
  }
}
```

If we run the code generator again (`npm run gen`) we'll now find a new file in the `src` folder that contains some React hooks that we can use.

## 3. Updating our `CreateGame` page

Time to refactor the `CreateGame` page to use this new hook. If we go to import the `../generated.tsx` file we'll find an export called `useCreateGameMutation`.

```typescript
import React from "react";
import { useCreateGameMutation } from "../generated";

const CreateGame: React.FC = () => {
  const [createGame] = useCreateGameMutation();

  return (
    <div>
      <h1>Create a new game!</h1>
      <button onClick={() => createGame()}>Start</button>
    </div>
  );
};

export default CreateGame;
```

We can then combine this with other React hooks to disable the button when the game is being created and navigate to the next page when it is:

```typescript
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useCreateGameMutation } from "../generated";

const CreateGame: React.FC = () => {
  const [creating, setCreating] = useState(false);
  const [
    createGame,
    { loading, called, data, error },
  ] = useCreateGameMutation();

  const history = useHistory();

  useEffect(() => {
    if (creating) {
      createGame();
    }
  }, [creating, createGame]);

  useEffect(() => {
    if (!loading && called && !error && data && data.createGame) {
      history.push(`/game/join/${data.createGame.id}`);
    } else if (error) {
      console.error(error);
    }
  }, [loading, called, data, error, history]);

  return (
    <div>
      <h1>Create a new game!</h1>
      <button disabled={creating} onClick={() => setCreating(true)}>
        Start a new game
      </button>
    </div>
  );
};

export default CreateGame;
```

## 4. Using mutation arguments

The `createGame` mutation didn't need any arguments, but mutations such as `startGame` and `addPlayerToGame` do, so let's look at how we use them and what power we get from TypeScript.

We'll create a new mutation operation that will combine these two into a single GraphQL call, in `src/operations/addPlayer.graphql`:

```graphql
mutation addPlayerScreen($id: ID!, $name: String!) {
  addPlayerToGame(id: $id, name: $name) {
    id
  }
  startGame(id: $id) {
    id
    players {
      id
      name
    }
  }
}
```

_While the data model is designed as a multiplayer game, we'll implement single player at the moment, which means we can combine the mutations into a single GraphQL call._

We can use the hook that is generated to get a mutation function with a `variables` argument that expects an object with the properties `id` and `name` which are both `string`s as defined in the schema:

```typescript
const [addPlayerToGame, { loading, data }] = useAddPlayerScreenMutation();

// snip
addPlayerToGame({
  variables: { id, name },
});
```

With this ready you can complete the remaining screens and then the game is playable.

## Running The Application

From a terminal run `npm start` from both the repository root and `api` folder to start the two servers, the web application will be on `http://localhost:3000` and the API on `http://localhost:7071`. Alternatively, you can use the VS Code launch of `Run full stack` to run both together with debuggers attached.

## App Setup

The React application we're using was created using [`create-react-app`](https://create-react-app.dev) with [TypeScript support](https://create-react-app.dev/docs/adding-typescript/):

```bash
$> npx create-react-app my-app --template typescript
```

Then the following dependencies were included:

```bash
$> npm install --save @apollo/client react-router-dom graphql
$> npm install --save-dev @types/react-router-dom
```

There are four skeleton pages that have been created in the [`pages`](pages) folder that represents the workflow of the game.

Lastly, the `src/App.tsx` file has been modified to create the [Apollo client](https://www.apollographql.com/docs/react/get-started/#connect-your-client-to-react) and connect to our server (the backend uses [a proxy](https://create-react-app.dev/docs/proxying-api-requests-in-development) to simplify access) and setup the routing.
