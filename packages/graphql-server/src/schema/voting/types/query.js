const queries = /* GraphQL */ `
  type Query {
    referendumVotes(
      referendumIndex: Int!
      offset: Int!
      limit: Int!
    ): PagedVotes!
  }
`;

module.exports = {
  queries,
};
