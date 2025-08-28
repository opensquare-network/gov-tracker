const { typeDefs } = require("./types");
const resolverFunctions = require("./resolvers");

const resolvers = {
  Query: {
    ...resolverFunctions,
  },
  Ticket: {
    who: (parent) => parent[0],
    amount: (parent) => parent[1],
  },
};

module.exports = {
  resolvers,
  typeDefs,
};
