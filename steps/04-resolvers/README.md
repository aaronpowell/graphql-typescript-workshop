# Step 4 - Creating Resolvers

We can get data out of our database, all that's left to do is connect that to the GraphQL resolvers so that when a query is received we can return something to the caller. So far there is an empty resolver that lives at `api/graphql/resolvers.ts`, let's start implementing the queries that we can perform.

## 1. Querying for games

Let's revisit the queries our schema exposes:

```graphql
type Query {
  game(id: ID!): Game
  games: [Game!]!
  playerResults(gameId: ID!, playerId: ID!): [PlayerResult!]!
}
```

We need to create a resolver to handle each of these things, so let's start returning all the games in the system.

```typescript
const resolvers = {
  Query: {
    game() {
      throw new Error("Method not implemented.");
    },
  },
};
```

## 2. Returning data

We're going to need our data sources in our resolvers, so how do we get those? We get them via the third argument provided to a resolver function, which is the Apollo Context.

```typescript
const resolvers = {
  Query: {
    game(_, __, { dataSources }) {
      throw new Error("Method not implemented.");
    },
  },
};
```

_I'm using `_` to denote arguments that I'm ignoring, but don't worry, we'll learn about them soon.\_

With our data source we can now return data:

```typescript
const resolvers = {
  Query: {
    game(_, __, { dataSource }) {
      return dataSources.game.getGames();
    },
  },
};
```

## 3. Getting a specific game

The next resolver we want to tackle is the one for getting a game by its `id`, mapping to the query `game(id: ID!): Game!`. But how do you get the `id`? That's that the second argument to the resolver function is for.

```typescript
const resolvers = {
  Query: {
    game(_, __, { dataSource }) {
      return dataSources.game.getGames();
    },
    game(_, { id }, { dataSources }) {
      return dataSources.game.getGame(id);
    },
  },
};
```

## 4. Getting player answers

The last query needing to be handled will return us the answers a player has submitted for a particular game.

```typescript
const resolvers = {
  Query: {
    game(_, __, { dataSource }) {
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
```

## 5. Testing our queries

We haven't got a way to create and play games yet, so grab a sample game from the bottom of this document and open up the GraphQL playground and let's try a query:

```graphql
query {
  games {
    id
    state
    players {
      id
      name
    }
    questions {
      question
    }
  }
}
```

You should now see all games and some of the information from the game.

## Running The Application

From a terminal run `npm start` from both the repository root and `api` folder to start the two servers, the web application will be on `http://localhost:3000` and the API on `http://localhost:7071`. Alternatively, you can use the VS Code launch of `Run full stack` to run both together with debuggers attached.

## Sample game data

```json
{
  "id": "lfwc",
  "modelType": "Game",
  "state": "Started",
  "players": [
    {
      "id": "itae",
      "modelType": "User",
      "name": "Aaron",
      "identityProvider": "not defined",
      "userDetails": "not defined",
      "userRoles": ["anonymous", "authenticated"]
    }
  ],
  "answers": [
    {
      "id": "lfwc-47-itae",
      "modelType": "UserAnswer",
      "answer": "Transport Layer",
      "question": {
        "id": "47",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "hard",
        "question": "Which of these is not a layer in the OSI model for data communications?",
        "correct_answer": "Connection Layer",
        "incorrect_answers": [
          "Application Layer",
          "Transport Layer",
          "Physical Layer"
        ],
        "modelType": "Question"
      },
      "user": {
        "id": "itae",
        "modelType": "User",
        "name": "Aaron",
        "identityProvider": "not defined",
        "userDetails": "not defined",
        "userRoles": ["anonymous", "authenticated"]
      }
    },
    {
      "id": "lfwc-48-itae",
      "modelType": "UserAnswer",
      "answer": "94",
      "question": {
        "id": "48",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "medium",
        "question": "What is the number of keys on a standard Windows Keyboard?",
        "correct_answer": "104",
        "incorrect_answers": ["64", "94", "76"],
        "modelType": "Question"
      },
      "user": {
        "id": "itae",
        "modelType": "User",
        "name": "Aaron",
        "identityProvider": "not defined",
        "userDetails": "not defined",
        "userRoles": ["anonymous", "authenticated"]
      }
    },
    {
      "id": "lfwc-42-itae",
      "modelType": "UserAnswer",
      "answer": "Musical Instrument Data Interface",
      "question": {
        "id": "42",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "easy",
        "question": "In computing, what does MIDI stand for?",
        "correct_answer": "Musical Instrument Digital Interface",
        "incorrect_answers": [
          "Musical Interface of Digital Instruments",
          "Modular Interface of Digital Instruments",
          "Musical Instrument Data Interface"
        ],
        "modelType": "Question"
      },
      "user": {
        "id": "itae",
        "modelType": "User",
        "name": "Aaron",
        "identityProvider": "not defined",
        "userDetails": "not defined",
        "userRoles": ["anonymous", "authenticated"]
      }
    },
    {
      "id": "lfwc-46-itae",
      "modelType": "UserAnswer",
      "answer": "Routing Information Protocol",
      "question": {
        "id": "46",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "hard",
        "question": "The acronym &quot;RIP&quot; stands for which of these?",
        "correct_answer": "Routing Information Protocol",
        "incorrect_answers": [
          "Runtime Instance Processes",
          "Regular Interval Processes",
          "Routine Inspection Protocol"
        ],
        "modelType": "Question"
      },
      "user": {
        "id": "itae",
        "modelType": "User",
        "name": "Aaron",
        "identityProvider": "not defined",
        "userDetails": "not defined",
        "userRoles": ["anonymous", "authenticated"]
      }
    },
    {
      "id": "lfwc-41-itae",
      "modelType": "UserAnswer",
      "answer": "128 bits",
      "question": {
        "id": "41",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "easy",
        "question": "How long is an IPv6 address?",
        "correct_answer": "128 bits",
        "incorrect_answers": ["32 bits", "64 bits", "128 bytes"],
        "modelType": "Question"
      },
      "user": {
        "id": "itae",
        "modelType": "User",
        "name": "Aaron",
        "identityProvider": "not defined",
        "userDetails": "not defined",
        "userRoles": ["anonymous", "authenticated"]
      }
    },
    {
      "id": "lfwc-25-itae",
      "modelType": "UserAnswer",
      "answer": "Central Processing Unit",
      "question": {
        "id": "25",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "medium",
        "question": "What is known as &quot;the brain&quot; of the Computer?",
        "correct_answer": "Central Processing Unit",
        "incorrect_answers": [
          "Motherboard",
          "Graphics Processing Unit",
          "Keyboard"
        ],
        "modelType": "Question"
      },
      "user": {
        "id": "itae",
        "modelType": "User",
        "name": "Aaron",
        "identityProvider": "not defined",
        "userDetails": "not defined",
        "userRoles": ["anonymous", "authenticated"]
      }
    },
    {
      "id": "lfwc-35-itae",
      "modelType": "UserAnswer",
      "answer": "Dennis Ritchie",
      "question": {
        "id": "35",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "easy",
        "question": "The C programming language was created by this American computer scientist. ",
        "correct_answer": "Dennis Ritchie",
        "incorrect_answers": ["Tim Berners Lee", "al-Khwārizmī", "Willis Ware"],
        "modelType": "Question"
      },
      "user": {
        "id": "itae",
        "modelType": "User",
        "name": "Aaron",
        "identityProvider": "not defined",
        "userDetails": "not defined",
        "userRoles": ["anonymous", "authenticated"]
      }
    },
    {
      "id": "lfwc-3-itae",
      "modelType": "UserAnswer",
      "answer": "8",
      "question": {
        "id": "3",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "easy",
        "question": "What amount of bits commonly equals one byte?",
        "correct_answer": "8",
        "incorrect_answers": ["1", "2", "64"],
        "modelType": "Question"
      },
      "user": {
        "id": "itae",
        "modelType": "User",
        "name": "Aaron",
        "identityProvider": "not defined",
        "userDetails": "not defined",
        "userRoles": ["anonymous", "authenticated"]
      }
    },
    {
      "id": "lfwc-28-itae",
      "modelType": "UserAnswer",
      "answer": "Quantum Programming",
      "question": {
        "id": "28",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "hard",
        "question": "What is the name of the process that sends one qubit of information using two bits of classical information?",
        "correct_answer": "Quantum Teleportation",
        "incorrect_answers": [
          "Super Dense Coding",
          "Quantum Entanglement",
          "Quantum Programming"
        ],
        "modelType": "Question"
      },
      "user": {
        "id": "itae",
        "modelType": "User",
        "name": "Aaron",
        "identityProvider": "not defined",
        "userDetails": "not defined",
        "userRoles": ["anonymous", "authenticated"]
      }
    },
    {
      "id": "lfwc-16-itae",
      "modelType": "UserAnswer",
      "answer": "&lt;marquee&gt;&lt;/marquee&gt;",
      "question": {
        "id": "16",
        "category": "Science: Computers",
        "type": "multiple",
        "difficulty": "medium",
        "question": "In HTML, which non-standard tag used to be be used to make elements scroll across the viewport?",
        "correct_answer": "&lt;marquee&gt;&lt;/marquee&gt;",
        "incorrect_answers": [
          "&lt;scroll&gt;&lt;/scroll&gt;",
          "&lt;move&gt;&lt;/move&gt;",
          "&lt;slide&gt;&lt;/slide&gt;"
        ],
        "modelType": "Question"
      },
      "user": {
        "id": "itae",
        "modelType": "User",
        "name": "Aaron",
        "identityProvider": "not defined",
        "userDetails": "not defined",
        "userRoles": ["anonymous", "authenticated"]
      }
    }
  ],
  "questions": [
    {
      "id": "16",
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "medium",
      "question": "In HTML, which non-standard tag used to be be used to make elements scroll across the viewport?",
      "correct_answer": "&lt;marquee&gt;&lt;/marquee&gt;",
      "incorrect_answers": [
        "&lt;scroll&gt;&lt;/scroll&gt;",
        "&lt;move&gt;&lt;/move&gt;",
        "&lt;slide&gt;&lt;/slide&gt;"
      ],
      "modelType": "Question"
    },
    {
      "id": "28",
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "hard",
      "question": "What is the name of the process that sends one qubit of information using two bits of classical information?",
      "correct_answer": "Quantum Teleportation",
      "incorrect_answers": [
        "Super Dense Coding",
        "Quantum Entanglement",
        "Quantum Programming"
      ],
      "modelType": "Question"
    },
    {
      "id": "3",
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "easy",
      "question": "What amount of bits commonly equals one byte?",
      "correct_answer": "8",
      "incorrect_answers": ["1", "2", "64"],
      "modelType": "Question"
    },
    {
      "id": "35",
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "easy",
      "question": "The C programming language was created by this American computer scientist. ",
      "correct_answer": "Dennis Ritchie",
      "incorrect_answers": ["Tim Berners Lee", "al-Khwārizmī", "Willis Ware"],
      "modelType": "Question"
    },
    {
      "id": "25",
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "medium",
      "question": "What is known as &quot;the brain&quot; of the Computer?",
      "correct_answer": "Central Processing Unit",
      "incorrect_answers": [
        "Motherboard",
        "Graphics Processing Unit",
        "Keyboard"
      ],
      "modelType": "Question"
    },
    {
      "id": "41",
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "easy",
      "question": "How long is an IPv6 address?",
      "correct_answer": "128 bits",
      "incorrect_answers": ["32 bits", "64 bits", "128 bytes"],
      "modelType": "Question"
    },
    {
      "id": "46",
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "hard",
      "question": "The acronym &quot;RIP&quot; stands for which of these?",
      "correct_answer": "Routing Information Protocol",
      "incorrect_answers": [
        "Runtime Instance Processes",
        "Regular Interval Processes",
        "Routine Inspection Protocol"
      ],
      "modelType": "Question"
    },
    {
      "id": "42",
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "easy",
      "question": "In computing, what does MIDI stand for?",
      "correct_answer": "Musical Instrument Digital Interface",
      "incorrect_answers": [
        "Musical Interface of Digital Instruments",
        "Modular Interface of Digital Instruments",
        "Musical Instrument Data Interface"
      ],
      "modelType": "Question"
    },
    {
      "id": "48",
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "medium",
      "question": "What is the number of keys on a standard Windows Keyboard?",
      "correct_answer": "104",
      "incorrect_answers": ["64", "94", "76"],
      "modelType": "Question"
    },
    {
      "id": "47",
      "category": "Science: Computers",
      "type": "multiple",
      "difficulty": "hard",
      "question": "Which of these is not a layer in the OSI model for data communications?",
      "correct_answer": "Connection Layer",
      "incorrect_answers": [
        "Application Layer",
        "Transport Layer",
        "Physical Layer"
      ],
      "modelType": "Question"
    }
  ]
}
```
