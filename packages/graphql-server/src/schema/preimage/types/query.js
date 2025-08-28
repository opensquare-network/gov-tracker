const queries = /* GraphQL */ `
  type Query {
    preimages(hash: String, len: Int): [Preimage]!
  }
`;

module.exports = {
  queries,
};
