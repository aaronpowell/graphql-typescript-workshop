# Step 3 - Implementing a data store

With our GraphQL schema created, it's time for us to create a way to store the data that we need, so our clients can access it as desired. We're going to create an in-memory data store, to make things easier, but refer to [`README-DataSource-Cosmos.md`](README-DataSource-Cosmos.md) for how to implement the data store using [CosmosDB](https://azure.microsoft.com/services/cosmos-db/?WT.mc_id=javascript-13112-aapowell) and allowing persistence.

While our GraphQL schema has a model for the way the data looks, it might not match what our underlying data store looks like exactly. The reason for this is that the GraphQL schema represents how we want clients to understand our data, not how our internal domain understands it. There may be overlaps, but it won't be 100% the same.

## 1. Modeling data

Let's start with the `Question`. For our questions, we'll use the [Open Trivia Database](https://opentdb.com/) (it saves us coming up with our own!) to get some questions which look like this:

```json
{
  "category": "Geography",
  "type": "multiple",
  "difficulty": "easy",
  "question": "What is the capital of Jamaica?",
  "correct_answer": "Kingston",
  "incorrect_answers": ["San Juan", "Port-au-Prince", "Bridgetown"]
}
```

_Note: I've included a file at `api/trivia.json` that contains questions that have been pulled from the API so you don't need to do it yourself._

This looks _close_ to what we have in our GraphQL type, but not exactly the same. We don't have an `id` property, there's fields we don't need, etc.. Rather than processing the response to fit what our schema has, we'll rely on our GraphQL Resolvers to map between the types.

## 2. Defining a data store

Apollo provides us with a [data sources pattern](https://www.apollographql.com/docs/apollo-server/data/data-sources/) for accessing data, so we'll implement a few data sources to represent the different _things_ we are storing. Create a new file at `api/graphql/data/types.ts`, and we'll create an interface for accessing questions called `IQuestionDataSource`:

```typescript
export interface IQuestionDataSource {}
```

We'll need to do two operations on the data source, get a set of questions, and get a single question, but first we'll define a TypeScript type that matches what we get back from Open Trivia Database:

```typescript
export enum ModelType {
  Question = "Question",
  User = "User",
  UserAnswer = "UserAnswer",
  Game = "Game",
}

type Model = {
  id: string;
  modelType: ModelType;
};

export type QuestionModel = {
  question: string;
  category: string;
  incorrect_answers: string[];
  correct_answer: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
} & Model;
```

_The `ModelType` enum isn't needed for in memory, but we'll need that in Cosmos to identify the different document types in the collection._

Now we can update the `IQuestionDataSource` with some methods:

```typescript
export interface IQuestionDataSource {
  getQuestion(id: string): Promise<QuestionModel>;
  getQuestions(): Promise<QuestionModel[]>;
}
```

## 3. Implementing a data source

It's time to implement the data source, and to do that we'll create a new file `api/graphql/data/inMemory/QuestionDataSource.ts`:

```typescript
import { IQuestionDataSource, QuestionModel } from "../types";

export class QuestionDataSource implements IQuestionDataSource {
  // todo
}
```

Since we're following the Apollo data source pattern and creating our own data source, we'll bring in the base type from the `apollo-datasource` npm package:

```bash
$> cd api
$> npm install --save apollo-datasource
```

And use it on our implementation:

```typescript
import { IQuestionDataSource, QuestionModel } from "../types";
import { DataSource } from "apollo-datasource";

export class QuestionDataSource
  extends DataSource
  implements IQuestionDataSource {
  // todo
}
```

Now we can implement the data source. When it is created, we'll load the `trivia.json` file and then return items from it:

```typescript
import { DataSource } from "apollo-datasource";
import { arrayRandomiser } from "../../../utils";
import { IQuestionDataSource, QuestionModel } from "../types";

export class QuestionDataSource
  extends DataSource
  implements IQuestionDataSource {
  #questions: QuestionModel[];
  constructor() {
    super();
    this.#questions = require("../../../../trivia.json");
  }
  getQuestion(id: string): Promise<QuestionModel> {
    return Promise.resolve(this.#questions.find((q) => q.id === id));
  }

  getQuestions(): Promise<QuestionModel[]> {
    return Promise.resolve(arrayRandomiser(this.#questions).slice(0, 10));
  }
}
```

_You can create a little function called `arrayRandomiser` to randomise the question set, so you don't get the same ones each time._

## 4. Wiring in our data source

With our data source ready it's time to make it available to Apollo. We'll start by exporting it from a new file `api/graphql/data/index.ts`:

```typescript
import { QuestionDataSource as InMemoryQuestionDataSource } from "./inMemory/QuestionDataSource";
export const inMemoryDataSources = () => ({
  question: new InMemoryQuestionDataSource(),
});
```

And then importing that where we create our server (`api/graphql/index.ts`):

```typescript
import { ApolloServer } from "apollo-server-azure-functions";
import { importSchema } from "graphql-import";
import resolvers from "./resolvers";
import { inMemoryDataSources } from "./data/index";

const server = new ApolloServer({
  typeDefs: importSchema("./graphql/schema.graphql"),
  resolvers,
  dataSources: inMemoryDataSources,
  context: {},
});

export default server.createHandler();
```

## 5. Implement the remaining data stores

So far we have only created a data source for questions, but we need to work with players and games, so you'll need to implement those data sources too. Here's the TypeScript types to get you started:

```typescript
export type UserModel = {
  name: string;
  identityProvider: string;
  userDetails: string;
  userRoles: string[];
} & Model;

export type UserAnswerModel = {
  user: UserModel;
  question: QuestionModel;
  answer: string;
} & Model;

export type GameModel = {
  state: GameState;
  players: UserModel[];
  questions: QuestionModel[];
  answers: UserAnswerModel[];
} & Model;
```

## Running The Application

From a terminal run `npm start` from both the repository root and `api` folder to start the two servers, the web application will be on `http://localhost:3000` and the API on `http://localhost:7071`. Alternatively, you can use the VS Code launch of `Run full stack` to run both together with debuggers attached.
