import { CosmosClient } from "@azure/cosmos";
import { DataSources } from "apollo-server-core/src/graphqlOptions";
import { ApolloContext } from "../apolloContext";
import { GameDataSource as CosmosGameDataSource } from "./cosmos/GameDataSource";
import { QuestionDataSource as CosmosQuestionDataSource } from "./cosmos/QuestionDataSource";
import { UserDataSource as CosmosUserDataSource } from "./cosmos/UserDataSource";
import { GameDataSource as InMemoryGameDataSource } from "./inMemory/GameDataSource";
import { QuestionDataSource as InMemoryQuestionDataSource } from "./inMemory/QuestionDataSource";
import { UserDataSource as InMemoryUserDataSource } from "./inMemory/UserDataSource";
import { GameModel, ModelType, UserModel } from "./types";

export const cosmosDataSources: () => DataSources<ApolloContext> = () => {
  const client = new CosmosClient(process.env.CosmosDB);
  const container = client.database("trivia").container("game");

  return {
    user: new CosmosUserDataSource(container),
    question: new CosmosQuestionDataSource(container),
    game: new CosmosGameDataSource(container),
  };
};

const games: GameModel[] = [
  {
    id: "lfwc",
    modelType: ModelType.Game,
    state: "Started",
    players: [
      {
        id: "itae",
        modelType: ModelType.User,
        name: "Aaron",
        identityProvider: "not defined",
        userDetails: "not defined",
        userRoles: ["anonymous", "authenticated"],
      },
    ],
    answers: [
      {
        id: "lfwc-47-itae",
        modelType: ModelType.UserAnswer,
        answer: "Transport Layer",
        question: {
          id: "47",
          category: "Science: Computers",
          type: "multiple",
          difficulty: "hard",
          question:
            "Which of these is not a layer in the OSI model for data communications?",
          correct_answer: "Connection Layer",
          incorrect_answers: [
            "Application Layer",
            "Transport Layer",
            "Physical Layer",
          ],
          modelType: ModelType.Question,
        },
        user: {
          id: "itae",
          modelType: ModelType.User,
          name: "Aaron",
          identityProvider: "not defined",
          userDetails: "not defined",
          userRoles: ["anonymous", "authenticated"],
        },
      },
      {
        id: "lfwc-48-itae",
        modelType: ModelType.UserAnswer,
        answer: "94",
        question: {
          id: "48",
          category: "Science: Computers",
          type: "multiple",
          difficulty: "medium",
          question:
            "What is the number of keys on a standard Windows Keyboard?",
          correct_answer: "104",
          incorrect_answers: ["64", "94", "76"],
          modelType: ModelType.Question,
        },
        user: {
          id: "itae",
          modelType: ModelType.User,
          name: "Aaron",
          identityProvider: "not defined",
          userDetails: "not defined",
          userRoles: ["anonymous", "authenticated"],
        },
      },
      {
        id: "lfwc-42-itae",
        modelType: ModelType.UserAnswer,
        answer: "Musical Instrument Data Interface",
        question: {
          id: "42",
          category: "Science: Computers",
          type: "multiple",
          difficulty: "easy",
          question: "In computing, what does MIDI stand for?",
          correct_answer: "Musical Instrument Digital Interface",
          incorrect_answers: [
            "Musical Interface of Digital Instruments",
            "Modular Interface of Digital Instruments",
            "Musical Instrument Data Interface",
          ],
          modelType: ModelType.Question,
        },
        user: {
          id: "itae",
          modelType: ModelType.User,
          name: "Aaron",
          identityProvider: "not defined",
          userDetails: "not defined",
          userRoles: ["anonymous", "authenticated"],
        },
      },
      {
        id: "lfwc-46-itae",
        modelType: ModelType.UserAnswer,
        answer: "Routing Information Protocol",
        question: {
          id: "46",
          category: "Science: Computers",
          type: "multiple",
          difficulty: "hard",
          question: "The acronym &quot;RIP&quot; stands for which of these?",
          correct_answer: "Routing Information Protocol",
          incorrect_answers: [
            "Runtime Instance Processes",
            "Regular Interval Processes",
            "Routine Inspection Protocol",
          ],
          modelType: ModelType.Question,
        },
        user: {
          id: "itae",
          modelType: ModelType.User,
          name: "Aaron",
          identityProvider: "not defined",
          userDetails: "not defined",
          userRoles: ["anonymous", "authenticated"],
        },
      },
      {
        id: "lfwc-41-itae",
        modelType: ModelType.UserAnswer,
        answer: "128 bits",
        question: {
          id: "41",
          category: "Science: Computers",
          type: "multiple",
          difficulty: "easy",
          question: "How long is an IPv6 address?",
          correct_answer: "128 bits",
          incorrect_answers: ["32 bits", "64 bits", "128 bytes"],
          modelType: ModelType.Question,
        },
        user: {
          id: "itae",
          modelType: ModelType.User,
          name: "Aaron",
          identityProvider: "not defined",
          userDetails: "not defined",
          userRoles: ["anonymous", "authenticated"],
        },
      },
      {
        id: "lfwc-25-itae",
        modelType: ModelType.UserAnswer,
        answer: "Central Processing Unit",
        question: {
          id: "25",
          category: "Science: Computers",
          type: "multiple",
          difficulty: "medium",
          question: "What is known as &quot;the brain&quot; of the Computer?",
          correct_answer: "Central Processing Unit",
          incorrect_answers: [
            "Motherboard",
            "Graphics Processing Unit",
            "Keyboard",
          ],
          modelType: ModelType.Question,
        },
        user: {
          id: "itae",
          modelType: ModelType.User,
          name: "Aaron",
          identityProvider: "not defined",
          userDetails: "not defined",
          userRoles: ["anonymous", "authenticated"],
        },
      },
      {
        id: "lfwc-35-itae",
        modelType: ModelType.UserAnswer,
        answer: "Dennis Ritchie",
        question: {
          id: "35",
          category: "Science: Computers",
          type: "multiple",
          difficulty: "easy",
          question:
            "The C programming language was created by this American computer scientist. ",
          correct_answer: "Dennis Ritchie",
          incorrect_answers: ["Tim Berners Lee", "al-Khwārizmī", "Willis Ware"],
          modelType: ModelType.Question,
        },
        user: {
          id: "itae",
          modelType: ModelType.User,
          name: "Aaron",
          identityProvider: "not defined",
          userDetails: "not defined",
          userRoles: ["anonymous", "authenticated"],
        },
      },
      {
        id: "lfwc-3-itae",
        modelType: ModelType.UserAnswer,
        answer: "8",
        question: {
          id: "3",
          category: "Science: Computers",
          type: "multiple",
          difficulty: "easy",
          question: "What amount of bits commonly equals one byte?",
          correct_answer: "8",
          incorrect_answers: ["1", "2", "64"],
          modelType: ModelType.Question,
        },
        user: {
          id: "itae",
          modelType: ModelType.User,
          name: "Aaron",
          identityProvider: "not defined",
          userDetails: "not defined",
          userRoles: ["anonymous", "authenticated"],
        },
      },
      {
        id: "lfwc-28-itae",
        modelType: ModelType.UserAnswer,
        answer: "Quantum Programming",
        question: {
          id: "28",
          category: "Science: Computers",
          type: "multiple",
          difficulty: "hard",
          question:
            "What is the name of the process that sends one qubit of information using two bits of classical information?",
          correct_answer: "Quantum Teleportation",
          incorrect_answers: [
            "Super Dense Coding",
            "Quantum Entanglement",
            "Quantum Programming",
          ],
          modelType: ModelType.Question,
        },
        user: {
          id: "itae",
          modelType: ModelType.User,
          name: "Aaron",
          identityProvider: "not defined",
          userDetails: "not defined",
          userRoles: ["anonymous", "authenticated"],
        },
      },
      {
        id: "lfwc-16-itae",
        modelType: ModelType.UserAnswer,
        answer: "&lt;marquee&gt;&lt;/marquee&gt;",
        question: {
          id: "16",
          category: "Science: Computers",
          type: "multiple",
          difficulty: "medium",
          question:
            "In HTML, which non-standard tag used to be be used to make elements scroll across the viewport?",
          correct_answer: "&lt;marquee&gt;&lt;/marquee&gt;",
          incorrect_answers: [
            "&lt;scroll&gt;&lt;/scroll&gt;",
            "&lt;move&gt;&lt;/move&gt;",
            "&lt;slide&gt;&lt;/slide&gt;",
          ],
          modelType: ModelType.Question,
        },
        user: {
          id: "itae",
          modelType: ModelType.User,
          name: "Aaron",
          identityProvider: "not defined",
          userDetails: "not defined",
          userRoles: ["anonymous", "authenticated"],
        },
      },
    ],
    questions: [
      {
        id: "16",
        category: "Science: Computers",
        type: "multiple",
        difficulty: "medium",
        question:
          "In HTML, which non-standard tag used to be be used to make elements scroll across the viewport?",
        correct_answer: "&lt;marquee&gt;&lt;/marquee&gt;",
        incorrect_answers: [
          "&lt;scroll&gt;&lt;/scroll&gt;",
          "&lt;move&gt;&lt;/move&gt;",
          "&lt;slide&gt;&lt;/slide&gt;",
        ],
        modelType: ModelType.Question,
      },
      {
        id: "28",
        category: "Science: Computers",
        type: "multiple",
        difficulty: "hard",
        question:
          "What is the name of the process that sends one qubit of information using two bits of classical information?",
        correct_answer: "Quantum Teleportation",
        incorrect_answers: [
          "Super Dense Coding",
          "Quantum Entanglement",
          "Quantum Programming",
        ],
        modelType: ModelType.Question,
      },
      {
        id: "3",
        category: "Science: Computers",
        type: "multiple",
        difficulty: "easy",
        question: "What amount of bits commonly equals one byte?",
        correct_answer: "8",
        incorrect_answers: ["1", "2", "64"],
        modelType: ModelType.Question,
      },
      {
        id: "35",
        category: "Science: Computers",
        type: "multiple",
        difficulty: "easy",
        question:
          "The C programming language was created by this American computer scientist. ",
        correct_answer: "Dennis Ritchie",
        incorrect_answers: ["Tim Berners Lee", "al-Khwārizmī", "Willis Ware"],
        modelType: ModelType.Question,
      },
      {
        id: "25",
        category: "Science: Computers",
        type: "multiple",
        difficulty: "medium",
        question: "What is known as &quot;the brain&quot; of the Computer?",
        correct_answer: "Central Processing Unit",
        incorrect_answers: [
          "Motherboard",
          "Graphics Processing Unit",
          "Keyboard",
        ],
        modelType: ModelType.Question,
      },
      {
        id: "41",
        category: "Science: Computers",
        type: "multiple",
        difficulty: "easy",
        question: "How long is an IPv6 address?",
        correct_answer: "128 bits",
        incorrect_answers: ["32 bits", "64 bits", "128 bytes"],
        modelType: ModelType.Question,
      },
      {
        id: "46",
        category: "Science: Computers",
        type: "multiple",
        difficulty: "hard",
        question: "The acronym &quot;RIP&quot; stands for which of these?",
        correct_answer: "Routing Information Protocol",
        incorrect_answers: [
          "Runtime Instance Processes",
          "Regular Interval Processes",
          "Routine Inspection Protocol",
        ],
        modelType: ModelType.Question,
      },
      {
        id: "42",
        category: "Science: Computers",
        type: "multiple",
        difficulty: "easy",
        question: "In computing, what does MIDI stand for?",
        correct_answer: "Musical Instrument Digital Interface",
        incorrect_answers: [
          "Musical Interface of Digital Instruments",
          "Modular Interface of Digital Instruments",
          "Musical Instrument Data Interface",
        ],
        modelType: ModelType.Question,
      },
      {
        id: "48",
        category: "Science: Computers",
        type: "multiple",
        difficulty: "medium",
        question: "What is the number of keys on a standard Windows Keyboard?",
        correct_answer: "104",
        incorrect_answers: ["64", "94", "76"],
        modelType: ModelType.Question,
      },
      {
        id: "47",
        category: "Science: Computers",
        type: "multiple",
        difficulty: "hard",
        question:
          "Which of these is not a layer in the OSI model for data communications?",
        correct_answer: "Connection Layer",
        incorrect_answers: [
          "Application Layer",
          "Transport Layer",
          "Physical Layer",
        ],
        modelType: ModelType.Question,
      },
    ],
  },
];
const users: UserModel[] = [];
export const inMemoryDataSources: () => DataSources<ApolloContext> = () => ({
  user: new InMemoryUserDataSource(users),
  question: new InMemoryQuestionDataSource(),
  game: new InMemoryGameDataSource(games),
});
