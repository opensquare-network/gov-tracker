const { vote } = require("./vote");
const { queries } = require("./query");

const typeDefs = [vote, queries];

module.exports = {
  typeDefs,
};
