const {
  chain: { getApi },
} = require("@osn/scan-common");
const { getFinishedReferenda } = require("../../store");
const {
  updateVotesForOneFinishedReferendum,
} = require("../../scripts/referenda/finished");

async function updateFinishedReferendaVotes(blockHeight) {
  const api = await getApi();
  const finishedReferenda = getFinishedReferenda(blockHeight);
  for (const referendumIndex of finishedReferenda) {
    await updateVotesForOneFinishedReferendum(api, {
      referendumIndex,
      voteFinishedHeight: blockHeight,
    });
  }
}

module.exports = {
  updateFinishedReferendaVotes,
};
