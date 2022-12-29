var express = require("express");
var { graphqlHTTP } = require("express-graphql");
var { buildSchema } = require("graphql");

// Construct a schema, using GraphQL schema language
var schema = buildSchema(`
    type Query {
        ip: String
    }
`);
const loggingMiddleware = (req, res, next) => {
  console.log("ip:", req.ip);
  next();
};
// The root provides a resolver function for each API endpoint
var root = {
  ip: function (args, request) {
    return request.ip;
  },
};
var app = express();
// Use the logging middleware
app.use(loggingMiddleware);
// Use the graphql middleware
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
