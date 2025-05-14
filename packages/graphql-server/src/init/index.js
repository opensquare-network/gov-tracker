const {
  governance: { initGovScanDb },
} = require("@gov-tracker/mongo");

async function initDbs() {
  await initGovScanDb();
}

module.exports = {
  initDbs,
};
