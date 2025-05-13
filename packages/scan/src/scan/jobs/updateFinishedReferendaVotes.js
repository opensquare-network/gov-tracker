const {
  chain: { getApi },
} = require("@osn/scan-common");
const { getFinishedReferenda } = require("../../store");
const {
  updateVotesForOneFinishedReferendum,
} = require("../../scripts/referenda/finished");

async function updateFinishedReferendaVotes(blockIndexer) {
  const api = await getApi();
  const finishedReferenda = getFinishedReferenda(blockIndexer.blockHeight);
  for (const referendumIndex of finishedReferenda) {
    await updateVotesForOneFinishedReferendum(api, {
      referendumIndex,
      voteFinishedHeight: blockIndexer.blockHeight,
    });
  }
}

module.exports = {
  updateFinishedReferendaVotes,
};
