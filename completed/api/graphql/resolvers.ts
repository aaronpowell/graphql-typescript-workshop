import { arrayRandomiser } from "../utils";
import { ModelType, UserAnswerModel } from "./data";
import { GameState, Resolvers } from "./generated";

const resolvers: Resolvers = {
  Query: {
    game(_, { id }, { dataStore }) {
      return dataStore.getGame(id);
    },
    games(_, __, { dataStore }) {
      return dataStore.getGames();
    },
    async playerResults(_, { gameId, playerId }, { dataStore }) {
      const game = await dataStore.getGame(gameId);

      const playerAnswers = game.answers.filter((a) => a.user.id === playerId);

      return playerAnswers.map((answer) => {
        const question = answer.question;
        return {
          name: answer.user.name,
          answers: arrayRandomiser(
            question.incorrect_answers.concat(question.correct_answer)
          ),
          question: question.question,
          correctAnswer: question.correct_answer,
          submittedAnswer: answer.answer,
          correct: answer.answer === question.correct_answer,
        };
      });
    },
  },
  Question: {
    answers(question) {
      const answers = arrayRandomiser(
        question.incorrect_answers.concat([question.correct_answer])
      );

      return answers;
    },
    correctAnswer(question) {
      return question.correct_answer;
    },
    id(question) {
      return question.id;
    },
    question(question) {
      return question.question;
    },
  },
  Player: {
    async game(user, { gameId }, { dataStore }) {
      const game = await dataStore.getGame(gameId);

      if (!game.players.some((player) => player.id === user.id)) {
        throw Error("Player not part of the game");
      }

      return game;
    },
    async games(user, _, { dataStore }) {
      const games = await dataStore.getUserGames(user.id);

      return games;
    }
  },
  Mutation: {
    async createGame(_, __, { dataStore }) {
      const game = await dataStore.createGame();

      return game;
    },
    async addPlayerToGame(_, { id, name }, { dataStore }) {
      const user = await dataStore.createUser(name);
      const game = await dataStore.getGame(id);
      game.players.push(user);
      await dataStore.updateGame(game);

      return user;
    },
    async startGame(_, { id }, { dataStore }) {
      const game = await dataStore.getGame(id);
      game.state = GameState.Started;
      return await dataStore.updateGame(game);
    },
    async submitAnswer(
      _,
      { answer, gameId, playerId, questionId },
      { dataStore }
    ) {
      const [game, user, question] = await Promise.all([
        dataStore.getGame(gameId),
        dataStore.getUser(playerId),
        dataStore.getQuestion(questionId),
      ]);

      const answerModel: UserAnswerModel = {
        id: `${gameId}-${questionId}-${playerId}`,
        modelType: ModelType.UserAnswer,
        answer,
        question,
        user,
      };

      game.answers.push(answerModel);

      await dataStore.updateGame(game);
      return user;
    },
  },
};

export default resolvers;
