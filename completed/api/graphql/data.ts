import { CosmosClient } from "@azure/cosmos";
import { arrayRandomiser } from "../utils";
import { GameState } from "./generated";

export enum ModelType {
  Question = "Question",
  User = "User",
  UserAnswer = "UserAnswer",
  Game = "Game",
}

type Model = {
  id: string;
  modelType: ModelType;
};

export type QuestionModel = {
  question: string;
  category: string;
  incorrect_answers: string[];
  correct_answer: string;
  type: string;
  difficulty: "easy" | "medium" | "hard";
} & Model;

export type UserModel = {
  name: string;
  identityProvider: string;
  userDetails: string;
  userRoles: string[];
} & Model;

export type UserAnswerModel = {
  user: UserModel;
  question: QuestionModel;
  answer: string;
} & Model;

export type GameModel = {
  state: GameState;
  players: UserModel[];
  questions: QuestionModel[];
  answers: UserAnswerModel[];
} & Model;

interface DataStore {
  getGames(): Promise<GameModel[]>;
  getGame(id: string): Promise<GameModel>;
  getUser(id: string): Promise<UserModel>;
  getUserGames(userId: string): Promise<GameModel[]>;
  getQuestion(id: string): Promise<QuestionModel>;
  createGame(): Promise<GameModel>;
  createUser(name: string): Promise<UserModel>;
  updateGame(game: GameModel): Promise<GameModel>;
}

const idGenerator = () => {
  const chars = "qwertyuioplkjhgfdsazxcvbnm";

  let code = "";

  for (let i = 0; i < 4; i++) {
    const random = Math.floor(Math.random() * chars.length);
    code += chars[random];
  }

  return code;
};

class CosmosDataStore implements DataStore {
  #client: CosmosClient;
  #databaseName = "trivia";
  #containerName = "game";

  #getContainer = () => {
    return this.#client
      .database(this.#databaseName)
      .container(this.#containerName);
  };

  #getQuestions = async () => {
    const container = this.#getContainer();

    const question = await container.items
      .query<QuestionModel>({
        query: "SELECT * FROM c WHERE c.modelType = @type",
        parameters: [{ name: "@type", value: ModelType.Question }],
      })
      .fetchAll();

    return question.resources;
  };

  async getQuestion(id: string) {
    const container = this.#getContainer();

    const question = await container.items
      .query<QuestionModel>({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: id }],
      })
      .fetchAll();

    return question.resources[0];
  }

  async getUser(id: string) {
    const container = this.#getContainer();

    const question = await container.items
      .query<UserModel>({
        query: "SELECT * FROM c WHERE c.id = @id",
        parameters: [{ name: "@id", value: id }],
      })
      .fetchAll();

    return question.resources[0];
  }

  constructor(client: CosmosClient) {
    this.#client = client;
  }

  async getUserGames(userId: string) {
    const container = this.#getContainer();

    const response = await container.items
      .query<GameModel>({
        query: `
          SELECT c as Game
          FROM c
          JOIN (SELECT p.id FROM p IN c.players WHERE p.id = @id) AS player
          WHERE c.modelType = @type`,
        parameters: [
          { name: "@id", value: userId },
          { name: "@type", value: ModelType.Game },
        ],
      })
      .fetchAll();

    return response.resources;
  }

  async getGames() {
    const container = this.#getContainer();

    const game = await container.items
      .query<GameModel>({
        query: "SELECT * FROM c WHERE c.modelType = @type",
        parameters: [{ name: "@type", value: ModelType.Game }],
      })
      .fetchAll();

    return game.resources;
  }

  async getGame(id: string) {
    const container = this.#getContainer();

    const game = await container.items
      .query<GameModel>({
        query: "SELECT * FROM c WHERE c.id = @id AND c.modelType = @type",
        parameters: [
          { name: "@id", value: id },
          { name: "@type", value: ModelType.Game },
        ],
      })
      .fetchAll();

    return game.resources[0];
  }

  async createGame() {
    const questions = await this.#getQuestions();
    const newGame: GameModel = {
      id: idGenerator(),
      modelType: ModelType.Game,
      state: GameState.WaitingForPlayers,
      players: [],
      answers: [],
      questions: arrayRandomiser(questions).slice(0, 10),
    };

    const container = this.#getContainer();
    const savedGame = await container.items.create(newGame);

    return savedGame.resource;
  }

  async createUser(name: string) {
    const container = this.#getContainer();

    // without doing a proper auth solution we'll pretend that names are unique
    const existingUser = await container.items
      .query<UserModel>({
        query:
          "SELECT TOP 1 * FROM c WHERE c.name = @name AND c.modelType = @type",
        parameters: [
          { name: "@name", value: name },
          { name: "@type", value: ModelType.User },
        ],
      })
      .fetchAll();

    if (existingUser.resources[0]) {
      return existingUser.resources[0];
    }

    const user: UserModel = {
      id: idGenerator(),
      modelType: ModelType.User,
      name,
      // fields used with Azure Static Web Apps auth
      identityProvider: "not defined",
      userDetails: "not defined",
      userRoles: ["anonymous", "authenticated"],
    };

    const savedUser = await container.items.create(user);
    return savedUser.resource;
  }

  async updateGame(game: GameModel) {
    const container = this.#getContainer();
    const response = await container
      .item(game.id, ModelType.Game)
      .replace(game);

    return response.resource;
  }
}

class MockDataStore implements DataStore {
  #questions: QuestionModel[];
  #users: UserModel[] = [];
  #games: GameModel[] = [];
  constructor() {
    this.#questions = require("../../trivia.json");
  }
  getUserGames(userId: string): Promise<GameModel[]> {
    return Promise.resolve(
      this.#games.filter((g) => g.players.some((p) => p.id === userId))
    );
  }
  getUser(id: string): Promise<UserModel> {
    return Promise.resolve(this.#users.find((u) => u.id === id));
  }
  getQuestion(id: string): Promise<QuestionModel> {
    return Promise.resolve(this.#questions.find((q) => q.id === id));
  }
  updateGame(game: GameModel): Promise<GameModel> {
    return Promise.resolve(game);
  }

  getGames() {
    return Promise.resolve(this.#games);
  }

  getGame(id: string): Promise<GameModel> {
    return Promise.resolve(this.#games.find((g) => g.id === id));
  }
  async createGame(): Promise<GameModel> {
    const questions = await this.getQuestions();
    const game: GameModel = {
      id: idGenerator(),
      modelType: ModelType.Game,
      state: GameState.WaitingForPlayers,
      answers: [],
      questions,
      players: [],
    };

    this.#games.push(game);

    return game;
  }
  createUser(name: string): Promise<UserModel> {
    const existingUser = this.#users.find((u) => u.name === name);

    if (existingUser) {
      return Promise.resolve(existingUser);
    }

    const user: UserModel = {
      id: idGenerator(),
      modelType: ModelType.User,
      name,
      // fields used with Azure Static Web Apps auth
      identityProvider: "not defined",
      userDetails: "not defined",
      userRoles: ["anonymous", "authenticated"],
    };

    this.#users.push(user);

    return Promise.resolve(user);
  }

  getQuestions(): Promise<QuestionModel[]> {
    return Promise.resolve(arrayRandomiser(this.#questions).slice(0, 10));
  }
}

export const dataStore = new CosmosDataStore(
  new CosmosClient(process.env.CosmosDB)
);

// export const dataStore = new MockDataStore();

export type Context = {
  dataStore: DataStore;
};
