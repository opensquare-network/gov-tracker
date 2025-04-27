const {
  mongo: { ScanDb },
  env: { getEnvOrThrow },
} = require("@osn/scan-common");

let db = null;

let referendaVoteCol = null;

async function initGovScanDb() {
  db = new ScanDb(
    getEnvOrThrow("MONGO_GOV_SCAN_URL"),
    getEnvOrThrow("MONGO_GOV_SCAN_NAME"),
  );
  await db.init();

  referendaVoteCol = await db.createCol("referendaVote");

  _createIndexes().then(() => console.log("proxy scan DB indexes created!"));
}

async function _createIndexes() {
  if (!db) {
    console.error("Please call initDb first to initialize proxy DB");
    process.exit(1);
  }

  // create indexes for referendaVoteCol
}

async function tryInit(col) {
  if (!col) {
    await initGovScanDb();
  }
}

async function getReferendaVoteCol() {
  await tryInit(referendaVoteCol);
  return referendaVoteCol;
}

async function getGovScanDb() {
  if (!db) {
    await initGovScanDb();
  }

  return db;
}


module.exports = {
  initGovScanDb,
  getReferendaVoteCol,
  getGovScanDb,
}
