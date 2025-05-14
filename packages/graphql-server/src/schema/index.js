const { makeExecutableSchema } = require("@graphql-tools/schema");
const {
  resolvers: votingResolvers,
  typeDefs: votingTypeDefs,
} = require("./voting");

let resolvers = [votingResolvers];
let typeDefs = [...votingTypeDefs];

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

module.exports = {
  schema,
};
