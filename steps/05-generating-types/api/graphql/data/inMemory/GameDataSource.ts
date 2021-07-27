import { DataSource } from "apollo-datasource";
import { idGenerator } from "../../../utils";
import { GameState } from "../../generated";
import { IGameDataSource, GameModel, ModelType, QuestionModel } from "../types";

export class GameDataSource extends DataSource implements IGameDataSource {
  constructor(private games: GameModel[]) {
    super();
  }
  getUserGames(userId: string): Promise<GameModel[]> {
    return Promise.resolve(
      this.games.filter((g) => g.players.some((p) => p.id === userId))
    );
  }

  updateGame(game: GameModel): Promise<GameModel> {
    return Promise.resolve(game);
  }

  getGames() {
    return Promise.resolve(this.games);
  }

  getGame(id: string): Promise<GameModel> {
    return Promise.resolve(this.games.find((g) => g.id === id));
  }

  createGame(questions: QuestionModel[]): Promise<GameModel> {
    throw new Error("Method not implemented.");
  }
}
