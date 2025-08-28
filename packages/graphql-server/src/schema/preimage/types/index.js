const { preimage } = require("./preimage");
const { queries } = require("./query");

const typeDefs = [preimage, queries];

module.exports = {
  typeDefs,
};
