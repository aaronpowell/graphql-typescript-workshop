import React from "react";
import { useParams } from "react-router-dom";

const CompleteGame: React.FC = () => {
  const { id, playerId } = useParams<{ id: string; playerId: string }>();

  return (
    <div>
      <p>
        Game {id} has completed for player {playerId}
      </p>
    </div>
  );
};

export default CompleteGame;
