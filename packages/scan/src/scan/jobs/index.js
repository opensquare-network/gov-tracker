const { updateGovScanDbHeight } = require("@gov-tracker/mongo/src/governance");
const {
  updateFinishedReferendaVotes,
} = require("./updateFinishedReferendaVotes");
const { updateActiveReferendaVotes } = require("./updateActiveReferendaVotes");

async function doBlockJob(blockIndexer) {
  await updateActiveReferendaVotes(blockIndexer);
  await updateFinishedReferendaVotes(blockIndexer.blockHeight);

  await updateGovScanDbHeight(blockIndexer.blockHeight);
}

module.exports = {
  doBlockJob,
};
