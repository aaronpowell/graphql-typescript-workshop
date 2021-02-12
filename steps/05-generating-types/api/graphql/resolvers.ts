import { arrayRandomiser } from "../utils";

const resolvers = {
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
};
export default resolvers;
