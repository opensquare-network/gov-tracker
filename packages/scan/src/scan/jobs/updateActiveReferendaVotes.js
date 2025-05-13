const { getNormalizedReferenda } = require("../query/referenda");
const { insertVotesForReferenda } = require("../../scripts/referenda/common");
const { hasVotedMark } = require("../../store");

async function updateActiveReferendaVotes(indexer) {
  if (!hasVotedMark(indexer.blockHeight)) {
    return;
  }
  const referenda = await getNormalizedReferenda(indexer);
  const activeReferenda = referenda.filter((r) => r.isActive);
  for (const { referendumIndex, trackId } of activeReferenda) {
    await insertVotesForReferenda({ referendumIndex, trackId }, indexer);
    console.log(`Active referendum ${referendumIndex} votes updated`);
  }
}

module.exports = {
  updateActiveReferendaVotes,
};
