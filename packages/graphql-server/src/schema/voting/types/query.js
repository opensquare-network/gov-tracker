const queries = /* GraphQL */ `
  type Query {
    referendaVotes(referendumIndex: Int!): [Vote]!
  }
`;

module.exports = {
  queries,
};
