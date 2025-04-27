require("dotenv").config();
const {
  governance: { initGovScanDb },
} = require("@gov-tracker/mongo");
const {
  chain: { subscribeLatestHeight },
} = require("@osn/scan-common");
const { scanGov } = require("./scan");

(async () => {
  await initGovScanDb();
  await subscribeLatestHeight();

  await scanGov();
  // todo: scan block chain
  console.log('hello world');
})();
