const { chain: { getBlockIndexer } } = require("@osn/scan-common");
const { handleEvents } = require("./events");
const { doBlockJob } = require("./jobs");

async function handleBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);
  await handleEvents(blockEvents, blockIndexer);

  await doBlockJob(blockIndexer);
}

module.exports = {
  handleBlock,
};
