import { ApolloServer } from "apollo-server-azure-functions";
import { loadSchemaSync } from "@graphql-tools/load";
import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { addResolversToSchema } from "@graphql-tools/schema";
import { join } from "path";
import resolvers from "./resolvers";
import { cosmosDataSources, inMemoryDataSources } from "./data/index";

const schema = loadSchemaSync(
  join(__dirname, "..", "..", "graphql", "schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);
const server = new ApolloServer({
  schema: addResolversToSchema({ schema, resolvers }),
  resolvers,
  dataSources: process.env.CosmosDB ? cosmosDataSources : inMemoryDataSources,
  context: {},
});

export default server.createHandler();
