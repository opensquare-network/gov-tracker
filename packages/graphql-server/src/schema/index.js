const { makeExecutableSchema } = require("@graphql-tools/schema");
const { indexer, json } = require("../types");
const {
  resolvers: votingResolvers,
  typeDefs: votingTypeDefs,
} = require("./voting");

let resolvers = [votingResolvers];
let typeDefs = [indexer, json, ...votingTypeDefs];

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

module.exports = {
  schema,
};
