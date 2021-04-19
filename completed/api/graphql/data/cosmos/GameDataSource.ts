import { CosmosDataSource } from "apollo-datasource-cosmosdb";
import { arrayRandomiser, idGenerator } from "../../../utils";
import { GameState } from "../../generated";
import { IGameDataSource, GameModel, ModelType, QuestionModel } from "../types";

export class GameDataSource
  extends CosmosDataSource<GameModel>
  implements IGameDataSource {
  async getUserGames(userId: string) {
    const response = await this.findManyByQuery({
      query: `
          SELECT *
          FROM c
          WHERE c.modelType = @type
          AND EXISTS(SELECT p.id FROM p IN c.players WHERE p.id = @id)`,
      parameters: [
        { name: "@id", value: userId },
        { name: "@type", value: ModelType.Game },
      ],
    });

    return response.resources;
  }

  async getGames() {
    const games = await this.findManyByQuery({
      query: "SELECT * FROM c WHERE c.modelType = @type",
      parameters: [{ name: "@type", value: ModelType.Game }],
    });

    return games.resources;
  }

  async getGame(id: string) {
    const game = await this.findManyByQuery({
      query: "SELECT TOP 1 * FROM c WHERE c.id = @id AND c.modelType = @type",
      parameters: [
        { name: "@id", value: id },
        { name: "@type", value: ModelType.Game },
      ],
    });

    return game.resources[0];
  }

  async createGame(questions: QuestionModel[]) {
    const newGame: GameModel = {
      id: idGenerator(),
      modelType: ModelType.Game,
      state: GameState.WaitingForPlayers,
      players: [],
      answers: [],
      questions: arrayRandomiser(questions).slice(0, 10),
    };

    const savedGame = await this.createOne(newGame);

    return savedGame.resource;
  }

  async updateGame(game: GameModel) {
    const response = await this.updateOne(game);

    return response.resource;
  }
}
