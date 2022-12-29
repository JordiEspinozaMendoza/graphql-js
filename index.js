var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    type RandomDie {
        numSides: Int!
        rollOnce: Int!
        roll(numRolls: Int!): [Int]
    }
    type Query {
        getDie(numSides: Int): RandomDie
    }
`);
class RandomDie {
  constructor(numSides) {
    this.numSides = numSides;
  }
  rollOnce() {
    return 1 + Math.floor(Math.random() * this.numSides);
  }
  roll({ numRolls }) {
    var output = [];
    for (var i = 0; i < numRolls; i++) {
      output.push(1 + Math.floor(Math.random() * (this.numSides || 6)));
    }
    return output;
  }
}
// The root provides a resolver function for each API endpoint
var root = {
  getDie: ({ numSides }) => {
    return new RandomDie(numSides || 6);
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
