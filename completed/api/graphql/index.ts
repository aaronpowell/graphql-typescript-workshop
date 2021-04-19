import { GraphQLFileLoader } from "@graphql-tools/graphql-file-loader";
import { loadSchemaSync } from "@graphql-tools/load";
import { addResolversToSchema } from "@graphql-tools/schema";
import { ApolloServer } from "apollo-server-azure-functions";
import { join } from "path";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cosmosDataSources, inMemoryDataSources } from "./data/index";
import resolvers from "./resolvers";

const schema = loadSchemaSync(
  join(__dirname, "..", "..", "graphql", "schema.graphql"),
  {
    loaders: [new GraphQLFileLoader()],
  }
);

const server = new ApolloServer({
  schema: addResolversToSchema({ schema, resolvers }),
  dataSources: cosmosDataSources,
  context: {},
});

export default server.createHandler();
