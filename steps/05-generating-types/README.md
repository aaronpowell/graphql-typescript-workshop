# Step 5 - Generating Types

While our server is working, we've lost a lot of the value of TypeScript's type-safety throughout our application, especially in our resolvers. _We_ know that the `Query` has a query of `game` which receives a `string` argument called `id` and returns a `Game` object, but we only know that because we've implemented it, as far as the compiler knows it's all `any` types, so if we were to mistype something we'd end up with a runtime error.

That's not what we want, especially with TypeScript on hand.

So our GraphQL schema is disconnected from the code that we're writing, and it's time to bridge that gap. After all, we already have that type information, it's just not available to us.

## 1. Generating TypeScript types from GraphQL

To generate our types, we're going to use a tool called [`graphql-code-generator`](https://graphql-code-generator.com/), which we'll install into the `api` project, and then run its setup:

```bash
$> cd api
$> npm install --save-dev @graphql-codegen/cli
$> npx graphql-codegen init
$> npm install
```

Follow the prompts, selecting that we're creating a _Backend - API or server_, provide a path to the schema (`./graphql/schema.graphql`), select that we want TypeScript + TypeScript Resolvers and output to `./graphql/generated.ts`.

You'll end up with a YAML file like so:

```yml
overwrite: true
schema: "./graphql/schema.graphql"
documents: null
generates:
  ./graphql/generated.ts:
    plugins:
      - "typescript"
      - "typescript-resolvers"
  ./graphql.schema.json:
    plugins:
      - "introspection"
```

The setup process also added a `npm run-script` (I called mine `gen`) which we can use to generate the TypeScript definitions:

```bash
$> npm run gen
```

You'll now find a new file at `api/graphql/generated.ts` that contains the TypeScript definitions from your schema. Neat, let's start using them.

## 2. Using the generated types

The first thing we can improve the types for is the `state` property of our `Game` model. Presently that is just a restricted string, allowing one of three values, but those values are driven by the `enum` in our GraphQL schema. Let's open up `api/graphql/data/types.ts` and update it:

```typescript
import { GameState } from "../generated";
// snip
export type GameModel = {
  state: GameState;
  players: UserModel[];
  questions: QuestionModel[];
  answers: UserAnswerModel[];
} & Model;
```

Now our model uses the same enum type, we don't have to worry about whether we used the right casing for `WaitingForPlayers`.

We'll move on now to a bigger area to improve our types, the `resolvers`. Because we told graphql-code-generator that we wanted to generate the TypeScript Resolvers we have a type that represents our schema that we can use, called `Resolvers`:

```typescript
import { Resolvers } from "./generated";

const resolvers: Resolvers = {
// snip
```

By specifying the the of the `resolvers` object we now get some type information given to us. If we look at the `id` argument of the `game` query, you'll notice that it knows it's a `string` type, and we are starting to bring the GraphQL types into our application.

_Aside: I would add `generated.ts` and `graphql.schema.json` to the `.gitignore` file, since they change often we probably don't want the major churn in git history._

## Running The Application

From a terminal run `npm start` from both the repository root and `api` folder to start the two servers, the web application will be on `http://localhost:3000` and the API on `http://localhost:7071`. Alternatively, you can use the VS Code launch of `Run full stack` to run both together with debuggers attached.

[<< Step 4, Implementing Resolvers](../04-resolvers) | [Step 6, Model Mapping >>](../06-model-mapping)
