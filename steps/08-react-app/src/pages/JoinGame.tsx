import React from "react";
import { useParams } from "react-router-dom";

const JoinGame: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      <h1>Join the game: {id}</h1>
    </div>
  );
};

export default JoinGame;
