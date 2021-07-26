# Step 2 - Creating a schema

It's time to create the schema for our GraphQL application. We're going to be building a trivia game, so we're going to need to model a few different types in GraphQL:

- `Game` - the games that have been played
- `Player` - the person playing the game
- `Question` - a question that can be asked
- `PlayerResult` - a players answer to a question

## 1. Extracting a schema

Since we're going to have quite a large schema, we're going to extract it out to a new file. Go ahead and create `api/graphql/schema.graphql`, then copy the existing schema from `api/graphql/index.ts` to it:

```graphql
type Query {
  hello: String
}
```

## 2. Loading an external schema

With our schema in a separate file, we need to load it into our server, and to do that we'll use the `@graphql-tools/load`, `@graphql-tools/graphql-file-loader`, `@graphql-tools/schema` npm packages.

```bash
$> cd api
$> npm install --save @graphql-tools/load @graphql-tools/graphql-file-loader @graphql-tools/schema
```

Now we can remove the embedded schema are load it up. Update the `api/graphql/index.ts` file to do that:

```typescript
import { ApolloServer } from "apollo-server-azure-functions";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { join } from "path";

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello from our GraphQL backend!",
  },
};

const schema = loadSchemaSync(
  join(__dirname, "..", "..", "graphql", "schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

const server = new ApolloServer({
  schema: addResolversToSchema({ schema, resolvers }),
});

export default server.createHandler();
```

Launch the server and everything should still be working.

## 3. Creating our new schema

It's time to define our schema. Clear our the `schema.graphql` file so we can start fresh.

The first type we'll define is our `Question`:

```graphql
type Question {
  id: ID!
  question: String!
  correctAnswer: String!
  answers: [String!]!
}
```

Next, we'll define the `Game`:

```graphql
type Game {
  id: ID!
  state: GameState
  players: [Player!]!
  questions: [Question!]!
}
```

A `Game` can be in one of three states, waiting for players to join, in progress or completed. We'll use a GraphQL enum to model that:

```graphql
enum GameState {
  WaitingForPlayers
  Started
  Completed
}
```

Now we'll define the `Player`, as the `Game` needs a list of them:

```graphql
type Player {
  id: ID!
  name: String!
  game(gameId: ID): Game!
  games: [Game!]!
}
```

Notice that we're going to be able to request all the games for a player or a specific game they are in.

Lastly, we'll define a `PlayerResult` type, which is used to model the answer a player gave to a question:

```graphql
type PlayerResult {
  name: String!
  question: String!
  submittedAnswer: String!
  correctAnswer: String!
  answers: [String!]!
  correct: Boolean
}
```

## 4. Defining our queries

With the types defined, we need to expose a way for clients to query for them. This is where we define a `Query` type to provide to the `schema` portion of our GraphQL schema. Let's think about what we want to expose from our underlying data in a queryable fashion, we want to get a specific game, we want to get a players answers and we want a way to get all games that have been played.

Let's model that as a `Query`:

```graphql
type Query {
  game(id: ID!): Game
  games: [Game!]!
  playerResults(gameId: ID!, playerId: ID!): [PlayerResult!]!
}
```

With our `Query` defined we can now create our schema:

```graphql
schema {
  query: Query
}
```

And now we need to remove the old resolver from `graphql/index.ts`, we'll just have an empty query for now:

```typescript
const resolvers = {
  Query: {},
};
```

Now when we run our application and open up the Banana Cake Pop, we can inspect our more complex schema. You can also write queries against the new schema, but you'll find that you get errors because our resolvers aren't implemented.

## Running The Application

From a terminal run `npm start` from both the repository root and `api` folder to start the two servers, the web application will be on `http://localhost:3000` and the API on `http://localhost:7071`. Alternatively, you can use the VS Code launch of `Run full stack` to run both together with debuggers attached.

[<< Step 1, Setup](../01-setup) | [Step 3, Implementing a data store >>](../03-data-storage)
