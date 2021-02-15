import { useMutation } from "@apollo/client";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { CreateGameDocument } from "../generated";

const CreateGame: React.FC = () => {
  const [creating, setCreating] = useState(false);
  const [createGame, { loading, called, data, error }] = useMutation(
    CreateGameDocument
  );

  const history = useHistory();

  useEffect(() => {
    if (creating) {
      createGame();
    }
  }, [creating, createGame]);

  useEffect(() => {
    if (!loading && called && !error && data && data.createGame) {
      history.push(`/game/join/${data.createGame.id}`);
    } else if (error) {
      console.error(error);
    }
  }, [loading, called, data, error, history]);

  return (
    <div>
      <h1>Create a new game!</h1>
      <button disabled={creating} onClick={() => setCreating(true)}>
        Start a new game
      </button>
    </div>
  );
};

export default CreateGame;
