import { GameDataStore, QuestionDataStore, UserDataStore } from "./data/types";

export type ApolloContext = {
  dataSources: {
    user: UserDataStore;
    game: GameDataStore;
    question: QuestionDataStore;
  };
};
