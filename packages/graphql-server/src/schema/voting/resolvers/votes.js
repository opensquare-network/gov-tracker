const {
  governance: { getReferendaVoteCol },
} = require("@gov-tracker/mongo");

async function referendaVotes(_, _args) {
  const { referendumIndex } = _args;
  let q = { referendumIndex };

  const col = await getReferendaVoteCol();
  return await col
    .find(q, { projection: { _id: 0 } })
    .sort({ "indexer.blockHeight": -1 })
    .toArray();
}

module.exports = {
  referendaVotes,
};
