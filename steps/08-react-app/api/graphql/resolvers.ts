import { arrayRandomiser } from "../utils";
import { ModelType, UserAnswerModel } from "./data/types";
import { GameState, Resolvers } from "./generated";

const resolvers: Resolvers = {
  Query: {
    game(_, { id }, { dataSources }) {
      return dataSources.game.getGame(id);
    },
    games(_, __, { dataSources }) {
      return dataSources.game.getGames();
    },
    async playerResults(_, { gameId, playerId }, { dataSources }) {
      const game = await dataSources.game.getGame(gameId);

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
    async game(user, { gameId }, { dataSources }) {
      const game = await dataSources.game.getGame(gameId);

      if (!game.players.some((player) => player.id === user.id)) {
        throw Error("Player not part of the game");
      }

      return game;
    },
    async games(user, _, { dataSources }) {
      const games = await dataSources.game.getUserGames(user.id);

      return games;
    },
  },
  Mutation: {
    async createGame(_, __, { dataSources }) {
      const questions = await dataSources.question.getQuestions();
      const game = await dataSources.game.createGame(questions);

      return game;
    },
    async addPlayerToGame(_, { id, name }, { dataSources }) {
      const user = await dataSources.user.createUser(name);
      const game = await dataSources.game.getGame(id);
      game.players.push(user);
      await dataSources.game.updateGame(game);

      return user;
    },
    async startGame(_, { id }, { dataSources }) {
      const game = await dataSources.game.getGame(id);
      game.state = GameState.Started;
      return await dataSources.game.updateGame(game);
    },
    async submitAnswer(
      _,
      { answer, gameId, playerId, questionId },
      { dataSources }
    ) {
      const [game, user, question] = await Promise.all([
        dataSources.game.getGame(gameId),
        dataSources.user.getUser(playerId),
        dataSources.question.getQuestion(questionId),
      ]);

      const answerModel: UserAnswerModel = {
        id: `${gameId}-${questionId}-${playerId}`,
        modelType: ModelType.UserAnswer,
        answer,
        question,
        user,
      };

      game.answers.push(answerModel);

      await dataSources.game.updateGame(game);
      return user;
    },
  },
};

export default resolvers;
