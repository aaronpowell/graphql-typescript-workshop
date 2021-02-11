import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import CreateGame from "./pages/CreateGame";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import JoinGame from "./pages/JoinGame";
import PlayGame from "./pages/PlayGame";
import CompleteGame from "./pages/CompleteGame";

const client = new ApolloClient({
  uri: "/api/graphql",
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Router>
        <div className="App">
          <Route path="/" exact component={CreateGame} />
          <Route path="/game/join/:id" component={JoinGame} />
          <Route path="/game/play/:id/:playerId" component={PlayGame} />
          <Route path="/game/finish/:id/:playerId" component={CompleteGame} />
        </div>
      </Router>
    </ApolloProvider>
  );
}

export default App;
