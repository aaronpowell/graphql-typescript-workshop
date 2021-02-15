import React from "react";
import { useParams } from "react-router-dom";

const PlayGame: React.FC = () => {
  const { id } = useParams<{ id: string; playerId: string }>();

  return (
    <div>
      <h1>Play game {id}!</h1>
    </div>
  );
};

export default PlayGame;
