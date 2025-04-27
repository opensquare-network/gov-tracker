require("dotenv").config();
const {
  chain: { getApi, getBlockIndexer },
} = require("@osn/scan-common");
const { getNormalizedReferenda } = require("./scan/query/referenda");

(async () => {
  const blockHeights = [
    25312481,
  ];

  const api = await getApi();
  for (const height of blockHeights) {
    const blockHash = await api.rpc.chain.getBlockHash(height);
    const block = await api.rpc.chain.getBlock(blockHash);
    // const allEvents = await api.query.system.events.at(blockHash);

    const blockIndexer = getBlockIndexer(block.block);
    const referenda = await getNormalizedReferenda(blockIndexer);
    console.log(referenda);
  }

  console.log("finished");
  process.exit(0);
})();
