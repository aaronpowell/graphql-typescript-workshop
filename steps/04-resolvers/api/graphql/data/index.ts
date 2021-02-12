import { CosmosClient } from "@azure/cosmos";
import { GameDataSource as CosmosGameDataSource } from "./cosmos/GameDataSource";
import { QuestionDataSource as CosmosQuestionDataSource } from "./cosmos/QuestionDataSource";
import { UserDataSource as CosmosUserDataSource } from "./cosmos/UserDataSource";
import { GameDataSource as InMemoryGameDataSource } from "./inMemory/GameDataSource";
import { QuestionDataSource as InMemoryQuestionDataSource } from "./inMemory/QuestionDataSource";
import { UserDataSource as InMemoryUserDataSource } from "./inMemory/UserDataSource";
import { GameModel, UserModel } from "./types";

export const cosmosDataSources = () => {
  const client = new CosmosClient(process.env.CosmosDB);
  const container = client.database("trivia").container("game");

  return {
    user: new CosmosUserDataSource(container),
    question: new CosmosQuestionDataSource(container),
    game: new CosmosGameDataSource(container),
  };
};

const games: GameModel[] = [];
const users: UserModel[] = [];
export const inMemoryDataSources = () => ({
  user: new InMemoryUserDataSource(users),
  question: new InMemoryQuestionDataSource(),
  game: new InMemoryGameDataSource(games),
});
