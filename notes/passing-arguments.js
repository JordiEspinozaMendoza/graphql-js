var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    type Query {
        quoteOfTheDay: String
        random: Float!
        rollDice(numDice: Int!, numSides: Int): [Int]
    }
`);

// The root provides a resolver function for each API endpoint
var root = {
  quoteOfTheDay: () => {
    return Math.random() < 0.5 ? "Take it easy" : "Salvation lies within";
  },
  random: () => {
    return Math.random();
  },
  rollDice: (args) => {
    var output = [];
    const { numDice, numSides } = args;
    for (var i = 0; i < numDice; i++) {
      output.push(1 + Math.floor(Math.random() * (numSides || 6)));
    }
    return output;
  },
};
var app = express();
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
  })
);
const config = process.env;
const port = config.PORT;
app.listen(port);
console.log(`Running a GraphQL API server at localhost:${port}/graphql`);