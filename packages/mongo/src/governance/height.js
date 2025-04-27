const { getGovScanDb } = require("./db");

async function updateGovScanDbHeight(height) {
  const db = getGovScanDb();
  await db.updateScanHeight(height);
}

module.exports = {
  updateGovScanDbHeight,
}
