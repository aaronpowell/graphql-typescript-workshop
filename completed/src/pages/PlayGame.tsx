import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import useInterval from "../useInterval";
import {
  Question,
  useGetGameQuery,
  useSubmitAnswerMutation,
} from "../generated";

const PlayGame: React.FC = () => {
  const { id, playerId } = useParams<{ id: string; playerId: string }>();
  const history = useHistory();
  const [timeRemaining, setTimeRemaining] = useState(30);
  const [answer, setAnswer] = useState("");
  const { loading, data } = useGetGameQuery({ variables: { id } });
  const [question, setQuestion] = useState<{
    question: string;
    answers: string[];
    id: string;
  }>();
  const [
    submitAnswer,
    { loading: mutationLoading },
  ] = useSubmitAnswerMutation();
  const [questions, setQuestions] = useState<
    Pick<Question, "id" | "question" | "answers">[]
  >([]);

  useEffect(() => {
    if (!loading && data && data.game) {
      setQuestions([...data.game.questions]);
    }
  }, [loading, data]);

  useInterval(() => {
    if (question) {
      if (timeRemaining === 0) {
        const q = questions.pop();

        if (!q) {
          history.push(`/game/finish/${id}/${playerId}`);
          return;
        } else {
          setTimeRemaining(30);
          setQuestion(q);
          setAnswer("");
        }
      } else {
        setTimeRemaining(timeRemaining - 1);
      }
    }
  }, 1000);

  useEffect(() => {
    if (questions.length) {
      const q = questions.pop();
      setTimeRemaining(30);
      setQuestion(q);
    }
  }, [questions]);

  useEffect(() => {
    if (timeRemaining === 0 && question) {
      submitAnswer({
        variables: {
          gameId: id,
          playerId,
          questionId: question.id,
          answer,
        },
      });
    }
  }, [submitAnswer, id, playerId, question, answer, timeRemaining]);

  if (loading || !question) {
    return <h1>Just getting the game ready, please wait</h1>;
  }

  return (
    <div>
      <h1>Play game {id}!</h1>
      <h2>Time remaining: {timeRemaining}</h2>
      <h2 dangerouslySetInnerHTML={{ __html: question.question }}></h2>
      <ul>
        {question.answers.map((a) => {
          return (
            <li key={a}>
              <label>
                <input
                  type="radio"
                  value={a}
                  onChange={() => setAnswer(a)}
                  name="answer"
                />
                <span dangerouslySetInnerHTML={{ __html: a }}></span>
              </label>
            </li>
          );
        })}
      </ul>
      <button onClick={() => setTimeRemaining(0)} disabled={mutationLoading}>
        Submit Answer
      </button>
    </div>
  );
};

export default PlayGame;
