import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useAddPlayerScreenMutation } from "../generated";

const JoinGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const history = useHistory();
  const [name, setName] = useState("");
  const [
    addPlayerToGame,
    { data: addPlayerData },
  ] = useAddPlayerScreenMutation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (loading) {
      addPlayerToGame({
        variables: { id, name },
      });
    }
  }, [loading, addPlayerToGame, id, name]);

  useEffect(() => {
    if (addPlayerData) {
      console.log(addPlayerData);

      history.push(`/game/play/${id}/${addPlayerData.addPlayerToGame.id}`);
    }
  });

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
        <button disabled={!name || loading} onClick={() => setLoading(true)}>
          Join the game
        </button>
      </div>
    </div>
  );
};

export default JoinGame;
