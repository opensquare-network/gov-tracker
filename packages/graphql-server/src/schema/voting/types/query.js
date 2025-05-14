const queries = /* GraphQL */ `
  type Query {
    votes(referendumIndex: Int!, offset: Int!, limit: Int!): PagedVotes!
  }
`;

module.exports = {
  queries,
};
