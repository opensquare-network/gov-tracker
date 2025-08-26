const preimage = /* GraphQL */ `
  type Preimage {
    hash: String
    len: Int
    hex: String
    ticket: Ticket
  }

  type Ticket {
    who: String
    amount: Float
  }
`;

module.exports = {
  preimage,
};
