import React from "react";
import { useParams } from "react-router-dom";
import { usePlayerResultsQuery } from "../generated";

const CompleteGame: React.FC = () => {
  const { id, playerId } = useParams<{ id: string; playerId: string }>();

  const { loading, data } = usePlayerResultsQuery({
    variables: {
      gameId: id,
      playerId,
    },
  });

  if (loading || !data) {
    return <h1>Waiting for your answers</h1>;
  }

  return (
    <div>
      <h1>Game over man, game over!</h1>
      {data.playerResults.map((result) => {
        return (
          <div key={result.question}>
            <h2>
              {result.correct ? "✅" : "❌"}
              <span
                dangerouslySetInnerHTML={{ __html: result.question }}
              ></span>{" "}
            </h2>
            <ul>
              {result.answers.map((a) => {
                return (
                  <li
                    key={a}
                    className={`${
                      a === result.submittedAnswer ? "submitted" : ""
                    } ${a === result.correctAnswer ? "correct" : ""}`}
                  >
                    <span dangerouslySetInnerHTML={{ __html: a }}></span>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default CompleteGame;
