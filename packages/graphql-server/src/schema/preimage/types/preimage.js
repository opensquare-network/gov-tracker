const preimage = /* GraphQL */ `
  type Preimage {
    hash: String
    hex: String
    requested: Requested
    unrequested: Unrequested
  }

  type Requested {
    maybeTicket: Ticket
    maybeLen: Int
    count: Int
  }

  type Unrequested {
    ticket: Ticket
    len: Int
  }

  type Ticket {
    who: String
    amount: Float
  }
`;

module.exports = {
  preimage,
};
