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

  referendaVoteCol.createIndex({ referendumIndex: 1 });
  referendaVoteCol.createIndex({ account: 1 });
  // For query delegations to one delegatee on a referendum
  referendaVoteCol.createIndex({
    referendumIndex: 1,
    isDelegating: 1,
    target: 1,
  });
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
