import { ApolloServer } from "apollo-server-azure-functions";
import { importSchema } from "graphql-import";
import resolvers from "./resolvers";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { cosmosDataSources, inMemoryDataSources } from "./data/index";

const server = new ApolloServer({
  typeDefs: importSchema("./graphql/schema.graphql"),
  resolvers,
  dataSources: inMemoryDataSources,
  context: {},
});

export default server.createHandler();
