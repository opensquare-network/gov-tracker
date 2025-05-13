const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const { hasVotes, getVotes, setVotes } = require("../../store/votes");

async function getVotesAtBlock(blockIndexer) {
  if (hasVotes(blockIndexer.blockHeight)) {
    return getVotes(blockIndexer.blockHeight);
  }

  const blockApi = await findBlockApi(blockIndexer.blockHash);
  if (!blockApi.query.convictionVoting?.votingFor) {
    return;
  }

  const votes = await blockApi.query.convictionVoting.votingFor.entries();
  setVotes(blockIndexer.blockHeight, votes);

  return votes;
}

module.exports = {
  getVotesAtBlock,
};
