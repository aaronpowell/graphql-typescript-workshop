import { arrayRandomiser } from "../utils";
import { Resolvers } from "./generated";

const resolvers: Resolvers = {
  Query: {
    games(_, __, { dataSources }) {
      return dataSources.game.getGames();
    },
    game(_, { id }, { dataSources }) {
      return dataSources.game.getGame(id);
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
};
export default resolvers;
