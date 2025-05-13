const {
  chain: { getBlockIndexer },
} = require("@osn/scan-common");
const { handleEvents } = require("./events");
const { doBlockJob } = require("./jobs");
const {
  clearVotedMark,
  clearFinishedReferendaAt,
  clearVotes,
} = require("../store");

function clearStore(blockHeight) {
  clearVotedMark(blockHeight);
  clearFinishedReferendaAt(blockHeight);
  clearVotes(blockHeight);
}

async function handleBlock(block, blockEvents) {
  const blockIndexer = getBlockIndexer(block);

  await handleEvents(blockEvents, blockIndexer);

  await doBlockJob(blockIndexer);

  clearStore(blockIndexer.blockHeight);
}

module.exports = {
  handleBlock,
};
