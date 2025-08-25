const { updateGovScanDbHeight } = require("@gov-tracker/mongo/src/governance");
const {
  updateFinishedReferendaVotes,
} = require("./updateFinishedReferendaVotes");
const { updateActiveReferendaVotes } = require("./updateActiveReferendaVotes");
const { updatePreimages } = require("./updatePreimages");

async function doBlockJob(blockIndexer) {
  await updateActiveReferendaVotes(blockIndexer);
  await updateFinishedReferendaVotes(blockIndexer);
  await updatePreimages(blockIndexer);

  await updateGovScanDbHeight(blockIndexer.blockHeight);
}

module.exports = {
  doBlockJob,
};
