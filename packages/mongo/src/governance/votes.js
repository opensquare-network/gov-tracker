const { getReferendaVoteCol } = require("./db");

async function batchInsertReferendaVotes(referendumIndex, votes = []) {
  const col = await getReferendaVoteCol();
  const bulk = col.initializeOrderedBulkOp();
  await bulk.find({ referendumIndex }).delete();
  for (const vote of votes) {
    bulk.insert({ referendumIndex, ...vote });
  }
  await bulk.execute();
}

module.exports = {
  batchInsertReferendaVotes,
};
