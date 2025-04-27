require("dotenv").config();
const {
  chain: { getApi, getBlockIndexer },
} = require("@osn/scan-common");
const { getNormalizedReferenda } = require("../../scan/query/referenda");
const { saveVotesForOneFinishedReferendum } = require("./finished");
const { insertVotesForActiveReferenda } = require("./active");
const chunk = require("lodash.chunk");
const { governance: { updateGovScanDbHeight, initGovScanDb } } = require("@gov-tracker/mongo");

async function getLatestHeight(api) {
  const header = await api.rpc.chain.getHeader();
  return header.number.toNumber();
}

(async () => {
  await initGovScanDb();
  const api = await getApi();
  const height = await getLatestHeight(api);
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const indexer = getBlockIndexer(block.block);

  const referenda = await getNormalizedReferenda(indexer);
  console.log(`Total ${referenda.length} queried`);
  const finishedReferenda = referenda.filter(r => !r.isActive);
  const finishedReferendaChunk = chunk(finishedReferenda, 10);
  for (const chunk of finishedReferendaChunk) {
    const promises = [];
    for (const referendum of chunk) {
      promises.push(saveVotesForOneFinishedReferendum(api, referendum));
    }
    await Promise.all(promises);
  }
  const activeReferenda = referenda.filter(r => r.isActive);
  await insertVotesForActiveReferenda(api, activeReferenda, indexer);

  await updateGovScanDbHeight(indexer.blockHeight);
  process.exit(0);
})();
