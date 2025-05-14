const vote = /* GraphQL */ `
  type PagedVotes {
    items: [Vote]!
    offset: Int!
    limit: Int!
    total: Int!
  }

  type Vote {
    referendumIndex: Int
    account: String
    isDelegating: Boolean
    isStandard: Boolean
    isSplit: Boolean
    isSplitAbstain: Boolean
    balance: String
    aye: Boolean
    conviction: Int
    votes: String
    delegations: Delegations
    queryAt: Int
  }

  type Delegations {
    votes: String
    capital: String
  }
`;

module.exports = {
  vote,
};
