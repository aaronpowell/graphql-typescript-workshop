# CosmosDB Data Source

Since our default implementation of the data sources are in memory and not persistent, let's have a look at how to create a persistent store. For this, we'll use [CosmosDB](https://azure.microsoft.com/services/cosmos-db/?WT.mc_id=javascript-13112-aapowell) with its SQL API.

_If you don't have an existing Azure account, you can [sign up for free](https://azure.microsoft.com/free/?WT.mc_id=javascript-13112-aapowell). I'd also recommend checking out the [CosmosDB Serverless preview](https://docs.microsoft.com/azure/cosmos-db/serverless?WT.mc_id=javascript-13112-aapowell) as the hosting option._

## 1. The CosmosDB data source

To implement the data source, we're going to use the [`apollo-datasource-cosmosdb`](https://github.com/andrejpk/apollo-datasource-cosmosdb) package.

```bash
$> cd api
$> npm install --save apollo-datasource-cosmosdb
```

## 2. Implementing a data source

We'll implement our `QuestionDataSource` against CosmosDB with a new file `api/graphql/data/cosmos/QuestionDataSource.ts`:

```typescript
import { CosmosDataSource } from "apollo-datasource-cosmosdb";
import { arrayRandomiser } from "../../../utils";
import { ModelType, IQuestionDataSource, QuestionModel } from "../types";

export class QuestionDataSource
  extends CosmosDataSource<QuestionModel>
  implements IQuestionDataSource {
  async getQuestions(): Promise<QuestionModel[]> {
    const questions = await this.findManyByQuery({
      query: "SELECT * FROM c WHERE c.modelType = @type",
      parameters: [{ name: "@type", value: ModelType.Question }],
    });

    return arrayRandomiser(questions.resources);
  }
  async getQuestion(id: string) {
    const question = await this.findOneById(id);

    return question;
  }
}
```

## 3. Using the CosmosDB data source

To use the data source, we'll need to add it to our exports in `api/graphql/data/index.ts`:

```typescript
import { CosmosClient } from "@azure/cosmos";
import { QuestionDataSource as CosmosQuestionDataSource } from "./cosmos/QuestionDataSource";

export const cosmosDataSources = () => {
  const client = new CosmosClient(process.env.CosmosDB);
  const container = client.database("trivia").container("game");

  return {
    question: new CosmosQuestionDataSource(container),
  };
};
// snip
```

We're initialising the `CosmosClient` and using a database named `trivia` with a container `game` for our storage. All data we store will be in that collection (questions, players and games), so we can use the same container for each of the other data sources when they are implemented.
