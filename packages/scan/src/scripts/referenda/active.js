const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const { insertVotesForReferenda } = require("./common");

async function insertVotesForActiveReferenda(referenda, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  if (!blockApi.query.convictionVoting?.votingFor) {
    return;
  }

  for (const { referendumIndex, trackId } of referenda) {
    await insertVotesForReferenda(
      { referendumIndex, trackId },
      indexer
    );
    console.log(`Active referendum ${referendumIndex} votes inserted`);
  }
}

module.exports = {
  insertVotesForActiveReferenda,
};
