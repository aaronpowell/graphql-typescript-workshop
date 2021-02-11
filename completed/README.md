# GraphQL + TypeScript workshop - Completed

Here is the completed application for the workshop, including the integration with CosmosDB to store the application data.

## Running The Application

_Before running the first time, you'll need to configure the data store, see below._

From a terminal run `npm start` from both the repository root and `api` folder to start the two servers, the web application will be on `http://localhost:3000` and the API on `http://localhost:7071`. Alternatively, you can use the VS Code launch of `Run full stack` to run both together with debuggers attached.

## Configuring the data store

Before the first run you will need to either configure the GraphQL server to work with CosmosDB, or to use the in-memory store.

### Using the in-memory store

To use the in-memory store, you need to open the [`api/graphql/data.ts`](api/graphql/data.ts) and comment out the `export` of the CosmosDB store implementation and instead use the `MockDataStore`:

```typescript
// export const dataStore = new CosmosDataStore(
//   new CosmosClient(process.env.CosmosDB)
// );

export const dataStore = new MockDataStore();
```

**Note**: With the in-memory store, all game data will be reset to defaults when the server is restarted.

### Using the CosmosDB store

To use the [CosmosDB](https://docs.microsoft.com/azure/cosmos-db/serverless?WT.mc_id=javascript-13112-aapowell) store, you'll need to [create a CosmosDB resource using the SQL API](https://docs.microsoft.com/azure/cosmos-db/create-cosmosdb-resources-portal?WT.mc_id=javascript-13112-aapowell) and [add some data](https://docs.microsoft.com/azure/cosmos-db/create-cosmosdb-resources-portal?WT.mc_id=javascript-13112-aapowell#add-data-to-your-database) (easiest approach is to upload [`api/trivia.json`](api/trivia.json)), then add the `Primary Connection String` (found in the Portal -> Keys for the resource) to [`api/local.settings.json`](api/local.settings.json) as the value of the `CosmosDB` field.

**Note**: If you don't have an Azure account, you can sign up [for free](https://azure.microsoft.com/free/?WT.mc_id=javascript-13112-aapowell).
