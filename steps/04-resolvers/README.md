# Step 4 - Creating Resolvers

We can get data out of our database, all that's left to do is connect that to the GraphQL resolvers so that when a query is received we can return something to the caller. So far there is an empty resolver that lives at `api/graphql/resolvers.ts`, let's start implementing the queries that we can perform.

## 1. Querying for games

Let's revisit the queries our schema exposes:

```graphql
type Query {
  game(id: ID!): Game
  games: [Game!]!
  playerResults(gameId: ID!, playerId: ID!): [PlayerResult!]!
}
```

We need to create a resolver to handle each of these things, so let's start returning all the games in the system.

```typescript
const resolvers = {
  Query: {
    games() {
      throw new Error("Method not implemented.");
    },
  },
};
```

## 2. Returning data

We're going to need our data sources in our resolvers, so how do we get those? We get them via the third argument provided to a resolver function, which is the Apollo Context.

```typescript
const resolvers = {
  Query: {
    games(_, __, { dataSources }) {
      throw new Error("Method not implemented.");
    },
  },
};
```

_I'm using `_` to denote arguments that I'm ignoring, but don't worry, we'll learn about them soon.\_

With our data source we can now return data:

```typescript
const resolvers = {
  Query: {
    games(_, __, { dataSources }) {
      return dataSources.game.getGames();
    },
  },
};
```

## 3. Getting a specific game

The next resolver we want to tackle is the one for getting a game by its `id`, mapping to the query `game(id: ID!): Game!`. But how do you get the `id`? That's that the second argument to the resolver function is for.

```typescript
const resolvers = {
  Query: {
    games(_, __, { dataSources }) {
      return dataSources.game.getGames();
    },
    game(_, { id }, { dataSources }) {
      return dataSources.game.getGame(id);
    },
  },
};
```

## 4. Getting player answers

The last query needing to be handled will return us the answers a player has submitted for a particular game.

```typescript
const resolvers = {
  Query: {
    games(_, __, { dataSources }) {
      return dataSources.game.getGames();
    },
    game(_, { id }, { dataSources }) {
      return dataSources.game.getGame(id);
    },
    async playerResults(_, { gameId, playerId }, { dataSources }) {
      const game = await dataSources.game.getGame(gameId);

      const playerAnswers = game.answers.filter((a) => a.user.id === playerId);

      return playerAnswers.map((answer) => {
        const question = answer.question;
        return {
          name: answer.user.name,
          answers: arrayRandomiser(
            question.incorrect_answers.concat(question.correct_answer)
          ),
          question: question.question,
          correctAnswer: question.correct_answer,
          submittedAnswer: answer.answer,
          correct: answer.answer === question.correct_answer,
        };
      });
    },
  },
};
```

## 5. Testing our queries

We haven't got a way to create and play games yet, so grab a [sample game](Sample-Data.md) and open up the GraphQL playground and let's try a query:

```graphql
query {
  games {
    id
    state
    players {
      id
      name
    }
    questions {
      question
    }
  }
}
```

You should now see all games and some of the information from the game.

## Running The Application

From a terminal run `npm start` from both the repository root and `api` folder to start the two servers, the web application will be on `http://localhost:3000` and the API on `http://localhost:7071`. Alternatively, you can use the VS Code launch of `Run full stack` to run both together with debuggers attached.

[<< Step 3, Implementing a data store](../03-data-storage) | [Step 5, Generating types >>](../05-generating-types)
