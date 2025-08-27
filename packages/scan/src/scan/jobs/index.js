const { updateGovScanDbHeight } = require("@gov-tracker/mongo/src/governance");
const { updatePreimages } = require("./updatePreimages");

async function doBlockJob(blockIndexer) {
  await updatePreimages(blockIndexer);

  await updateGovScanDbHeight(blockIndexer.blockHeight);
}

module.exports = {
  doBlockJob,
};
