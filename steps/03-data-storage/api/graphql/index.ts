import { ApolloServer } from "apollo-server-azure-functions";
import { importSchema } from "graphql-import";
import resolvers from "./resolvers";

const server = new ApolloServer({
  typeDefs: importSchema("./graphql/schema.graphql"),
  resolvers,
});

export default server.createHandler();
