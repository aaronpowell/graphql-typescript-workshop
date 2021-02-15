# Step 7 - Mutations

So far we've been focusing on getting data out of our data store, but not putting anything in. Well, it's time to look at doing that with GraphQL Mutations.

When it comes to thinking about type-safety in GraphQL, mutations are an area that we really want to leverage this, as the types we define in the schema represent how we need the data for our data stores.

## 1. Defining mutations

For our application there are four different reasons in which we'd like to change data, creating a game, adding a player to a game, starting the game and answering a question. We can model these mutations in our schema (`api/graphql/schema.graphql`):

```graphql
type Mutation {
  createGame: Game
  addPlayerToGame(id: ID!, name: String!): Player!
  startGame(id: ID!): Game
  submitAnswer(
    gameId: ID!
    playerId: ID!
    questionId: ID!
    answer: String!
  ): Player
}

schema {
  query: Query
  mutation: Mutation
}
```

Now when we generate our types, they'll be available on our resolvers:

```bash
$> npm run gen
```

## 2. Implementing Mutations

Mutations are implemented just like queries, on the resolver, so we'll add it to `api/graphql/resolvers.ts`. Let's start with an empty mutation handler:

```typescript
const resolvers: Resolvers = {
  Query: {
    // snip
  },
  Mutation: {},
};
```

In VS Code, if we activate autocomplete (`CTRL + SPACE`) the mutations we defined in the schema are now listed to be implemented. We'll implement the `createGame` mutation first:

```typescript
const resolvers: Resolvers = {
  Query: {
    // snip
  },
  Mutation: {
    async createGame(_, __, { dataSources }) {
      const questions = await dataSources.question.getQuestions();
      const game = await dataSources.game.createGame(questions);

      return game;
    },
  },
};
```

_Note: you'll need to implement the `createGame` and other methods on the data sources too._

Notice how that because we've strongly typed the `context` previously we get type information for `dataSources`. Now let's implement a mutation with arguments:

```typescript
const resolvers: Resolvers = {
  Query: {
    // snip
  },
  Mutation: {
    async createGame(_, __, { dataSources }) {
      const questions = await dataSources.question.getQuestions();
      const game = await dataSources.game.createGame(questions);

      return game;
    },
  },
  async addPlayerToGame(_, { id, name }, { dataSources }) {
    const user = await dataSources.user.createUser(name);
    const game = await dataSources.game.getGame(id);
    game.players.push(user);
    await dataSources.game.updateGame(game);

    return user;
  },
};
```

## 3. Testing our mutation

Run the GraphQL server and navigate to the GraphQL Playground then execute a mutation to create a game:

```graphql
mutation {
  createGame {
    id
    questions {
      question
      answers
    }
  }
}
```

## Running The Application

From a terminal run `npm start` from both the repository root and `api` folder to start the two servers, the web application will be on `http://localhost:3000` and the API on `http://localhost:7071`. Alternatively, you can use the VS Code launch of `Run full stack` to run both together with debuggers attached.
