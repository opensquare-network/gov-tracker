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
    deposit: Ticket
    len: Int
  }

  type Unrequested {
    ticket: Ticket
    len: Int
    deposit: Ticket
  }

  type Ticket {
    who: String
    amount: Float
  }
`;

module.exports = {
  preimage,
};
