const {
  chain: { getBlockIndexer },
} = require("@osn/scan-common");

async function getIndexerByHeight(api, height) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const block = await api.rpc.chain.getBlock(blockHash);
  return getBlockIndexer(block.block);
}

module.exports = {
  getIndexerByHeight,
};
