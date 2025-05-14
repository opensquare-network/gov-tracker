const {
  governance: { getReferendaVoteCol },
} = require("@gov-tracker/mongo");
const isEmpty = require("lodash.isempty");

async function votes(_, _args) {
  const { referendumIndex, offset, limit } = _args;
  if (parseInt(limit) > 100) {
    throw new Error("Over max page size 100");
  }

  let q = {};
  if (referendumIndex) {
    Object.assign(q, { referendumIndex });
  }

  const col = await getReferendaVoteCol();
  const items = await col
    .find(q, { projection: { _id: 0 } })
    .sort({ "indexer.blockHeight": -1 })
    .skip(offset)
    .limit(limit)
    .toArray();

  let total;
  if (isEmpty(q)) {
    total = await col.estimatedDocumentCount();
  } else {
    total = await col.countDocuments(q);
  }

  return {
    items,
    offset,
    limit,
    total,
  };
}

module.exports = {
  votes,
};
