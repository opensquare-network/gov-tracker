require("dotenv").config();
const {
  chain: { getApi, getBlockIndexer },
} = require("@osn/scan-common");
const { getNormalizedReferenda } = require("../../scan/query/referenda");
const { saveVotesForOneFinishedReferendum, alreadyHasVotes } = require("./finished");
const { insertVotesForActiveReferenda } = require("./active");
const chunk = require("lodash.chunk");
const { governance: { updateGovScanDbHeight, initGovScanDb } } = require("@gov-tracker/mongo");
const sortBy = require("lodash.sortby");

async function getLatestHeight(api) {
  const header = await api.rpc.chain.getHeader();
  return header.number.toNumber();
}

(async () => {
  await initGovScanDb();
  const api = await getApi();
  const height = 25789878;
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  const indexer = getBlockIndexer(block.block);

  const referenda = await getNormalizedReferenda(indexer);
  const sortedReferenda = sortBy(referenda, ["referendumIndex"]);
  console.log(`Total ${sortedReferenda.length} queried`);
  const finishedReferenda = sortedReferenda.filter(r => !r.isActive);
  const finishedReferendaChunk = chunk(finishedReferenda, 10);
  let count = 0;
  for (const chunk of finishedReferendaChunk) {
    const promises = [];
    for (const referendum of chunk) {
      if (count > 10) {
        process.exit(0);
      }

      const { referendumIndex, voteFinishedHeight } = referendum;
      const handled = await alreadyHasVotes(referendumIndex);
      if (!handled) {
        promises.push(saveVotesForOneFinishedReferendum(api, referendum));
        count += 1;
      }
    }
    await Promise.all(promises);
  }
  const activeReferenda = sortedReferenda.filter(r => r.isActive);
  await insertVotesForActiveReferenda(activeReferenda, indexer);

  await updateGovScanDbHeight(indexer.blockHeight);
  process.exit(0);
})();
