import { GameState } from "../generated";

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

export interface IGameDataSource {
  getGames(): Promise<GameModel[]>;
  getGame(id: string): Promise<GameModel>;
  createGame(questions: QuestionModel[]): Promise<GameModel>;
  updateGame(game: GameModel): Promise<GameModel>;
  getUserGames(userId: string): Promise<GameModel[]>;
}

export interface IUserDataSource {
  getUser(id: string): Promise<UserModel>;
  createUser(name: string): Promise<UserModel>;
}

export interface IQuestionDataSource {
  getQuestion(id: string): Promise<QuestionModel>;
  getQuestions(): Promise<QuestionModel[]>;
}
