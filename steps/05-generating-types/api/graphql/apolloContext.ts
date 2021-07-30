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
