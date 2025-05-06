const {
  chain: { getApi },
} = require("@osn/scan-common");
const chunk = require("lodash.chunk");
const { getFinishedReferenda } = require("../../store");
const {
  saveVotesForOneFinishedReferendum,
} = require("../../scripts/referenda/finished");

async function updateFinishedReferendaVotes(blockHeight) {
  const api = await getApi();
  const finishedReferenda = getFinishedReferenda(blockHeight);
  const finishedReferendaChunk = chunk(finishedReferenda, 10);
  for (const chunk of finishedReferendaChunk) {
    const promises = [];
    for (const referendumIndex of chunk) {
      promises.push(
        saveVotesForOneFinishedReferendum(api, {
          referendumIndex,
          voteFinishedHeight: blockHeight,
        })
      );
    }
    await Promise.all(promises);
  }
}

module.exports = {
  updateFinishedReferendaVotes,
};
