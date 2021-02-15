import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAddPlayerScreenMutation } from "../generated";

const JoinGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [name, setName] = useState("");
  const [addPlayerToGame, { loading, data }] = useAddPlayerScreenMutation();

  useEffect(() => {
    if (data) {
      history.push(`/game/play/${id}/${data.addPlayerToGame.id}`);
    }
  }, [data, id, history]);

  return (
    <div>
      <h1>Join the game: {id}</h1>
      <div>
        <label htmlFor="name">Enter your name </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <button
          disabled={!name || loading}
          onClick={() =>
            addPlayerToGame({
              variables: { id, name },
            })
          }
        >
          Join the game
        </button>
      </div>
    </div>
  );
};

export default JoinGame;
