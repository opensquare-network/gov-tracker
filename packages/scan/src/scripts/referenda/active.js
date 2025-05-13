const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const { insertVotesForReferenda } = require("./common");

async function insertVotesForActiveReferenda(api, referenda, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  if (!blockApi.query.convictionVoting?.votingFor) {
    return;
  }

  const voting = await blockApi.query.convictionVoting.votingFor.entries();
  for (const { referendumIndex, trackId } of referenda) {
    await insertVotesForReferenda(
      voting,
      { referendumIndex, trackId },
      indexer
    );
    console.log(`Active referendum ${referendumIndex} votes inserted`);
  }
}

module.exports = {
  insertVotesForActiveReferenda,
};
