const { governance: { getGovScanDb } } = require("@gov-tracker/mongo");

async function doBlockJob(blockIndexer) {
  // todo: 1. update active referenda votes

  const db = getGovScanDb();
  await db.updateScanHeight(blockIndexer.blockHeight);
}

module.exports = {
  doBlockJob,
};
