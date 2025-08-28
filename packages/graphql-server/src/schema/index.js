const { makeExecutableSchema } = require("@graphql-tools/schema");
const {
  resolvers: votingResolvers,
  typeDefs: votingTypeDefs,
} = require("./voting");
const {
  resolvers: preimageResolvers,
  typeDefs: preimageTypeDefs,
} = require("./preimage");

let resolvers = [votingResolvers, preimageResolvers];
let typeDefs = [...votingTypeDefs, ...preimageTypeDefs];

const schema = makeExecutableSchema({
  resolvers,
  typeDefs,
});

module.exports = {
  schema,
};
