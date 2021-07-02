import { CosmosDataSource } from "apollo-datasource-cosmosdb";
import { IGameDataSource, GameModel, ModelType, QuestionModel } from "../types";

export class GameDataSource
  extends CosmosDataSource<GameModel>
  implements IGameDataSource
{
  async getUserGames(userId: string) {
    const response = await this.findManyByQuery({
      query: `
          SELECT c as Game
          FROM c
          JOIN (SELECT p.id FROM p IN c.players WHERE p.id = @id) AS player
          WHERE c.modelType = @type`,
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

  createGame(questions: QuestionModel[]): Promise<GameModel> {
    throw new Error("Method not implemented.");
  }

  async updateGame(game: GameModel) {
    const response = await this.container
      .item(game.id, game.modelType)
      .replace(game);

    return response.resource;
  }
}
