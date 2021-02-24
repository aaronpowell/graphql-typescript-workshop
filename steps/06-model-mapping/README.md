# Step 6 - Model Mapping

The types generated in the previous exercise gives us a level of type safety against the resolvers, but it doesn't get us all the way there, for example the `dataSources` is still an `any` type, meaning that once we start using the data source we lose all our type information.

The good news is that we can tackle this using graphql-code-generator by giving it some information about _our_ types, not just the types in the GraphQL schema.

## 1. Defining a context type

Data sources in Apollo are part of the `context` that is available within a request, and this is something that we probably want strongly typed. Let's start by defining a type for our context in `api/graphql/apolloContext.ts`:

```typescript
import {
  IGameDataSource,
  IQuestionDataSource,
  IUserDataSource,
} from "./data/types";

export type ApolloContext = {
  dataSources: {
    user: IUserDataSource;
    game: IGameDataSource;
    question: IQuestionDataSource;
  };
};
```

## 2. Telling the code generator about our context

With the context created, you _could_ go and put `{ dataSources }: ApolloContext` on each resolver function, but it'd be better to make the generated types aware of that, which we can do by editing the `config.yml` file to add a `config` node:

```yml
overwrite: true
schema: "./graphql/schema.graphql"
documents: null
generates:
  ./graphql/generated.ts:
    config:
      contextType: "./apolloContext#ApolloContext"
    plugins:
      - "typescript"
      - "typescript-resolvers"
  ./graphql.schema.json:
    plugins:
      - "introspection"
```

For the config we're providing a `contextType` and pointing that to the file, `./apolloContext` and then specifying an exported type of that file with `#` followed by the type name.

Run the generation script again and now look at the resolvers, `dataSources` will be strongly typed and we can see all the types cascade down... But this has introduced another problem, we're returning the data store model type, not the GraphQL type, and we have a mismatch.

## 3. Model mapping

To tackle this we're going to need to tell the generated types about the different models that we have and when to use which one, and we do that by providing a `mappers` config:

```yml
overwrite: true
schema: "./graphql/schema.graphql"
documents: null
generates:
  ./graphql/generated.ts:
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
```

The syntax is similar to the context, but that the type our resolvers are going to use parent types, which we will in turn map to their schema types (if the properties aren't the same). This means that we can now return `GameModel` from the `game` query, and its fields will be mapped on to a `Game` schema type, and if there are properties that aren't meant to be exposed, they'll be ignored.

## 4. Handling custom parents

With these changes in place to use our data models in conjunction with the GraphQL types we have everything working, so let's test a query. Launch the GraphQL server and run the following query:

```graphql
# Write your query or mutation here
query {
  games {
    id
    state
    questions {
      question
      correctAnswer
      answers
    }
  }
}
```

This is going to result in a server error, `Cannot return null for non-nullable field Question.answers.`. This is where we have our first disconnect between the types we're using. The `QuestionModel` has properties `correct_answer` and `incorrect_answers` whereas our GraphQL `Question` has `correctAnswer` and `answers`, so we're going to need a way to _resolve_ the differences between these to types.

For this, we can use the a resolver for the types and their properties. These resolvers will take the "parent object", which we got back from our data source, and then we return the value expected for the property. Let's do `Question.answers`:

```typescript
const resolvers: Resolvers = {
  Query: {
    // snip
  },
  Question: {
    answers(question) {
      const answers = arrayRandomiser(
        question.incorrect_answers.concat([question.correct_answer])
      );

      return answers;
    },
};
```

Here we've made a resolver for the `Question` type in our schema and added a function for a field we need to map, `answers`, that receives the `QuestionModel`, which we unpack and make an array of answers to send back to the client.

If we restart our server and run the query again, we'll get an expected result.

## Running The Application

From a terminal run `npm start` from both the repository root and `api` folder to start the two servers, the web application will be on `http://localhost:3000` and the API on `http://localhost:7071`. Alternatively, you can use the VS Code launch of `Run full stack` to run both together with debuggers attached.

[<< Step 5, Generating Types](../05-generating-types) | [Step 7, Mutations >>](../07-mutations)
