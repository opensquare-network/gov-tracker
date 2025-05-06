const { updateGovScanDbHeight } = require("@gov-tracker/mongo/src/governance");
const {
  updateFinishedReferendaVotes,
} = require("./updateFinishedReferendaVotes");

async function doBlockJob(blockIndexer) {
  // todo: 1. update active referenda votes
  await updateFinishedReferendaVotes(blockIndexer.blockHeight);

  await updateGovScanDbHeight(blockIndexer.blockHeight);
}

module.exports = {
  doBlockJob,
};
