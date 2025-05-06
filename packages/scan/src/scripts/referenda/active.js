const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const {
  normalizeVotingForEntry,
} = require("../../common/referenda/normalizeVotingForEntry");
const { extractDirectVotes } = require("../../common/referenda/direct");
const { extractDelegations } = require("../../common/referenda/delegation");
const { populateQueryAt } = require("../../common/referenda/common");
const {
  governance: { batchInsertReferendaVotes },
} = require("@gov-tracker/mongo");

async function insertVotesForActiveReferenda(api, referenda, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  if (!blockApi.query.convictionVoting?.votingFor) {
    return;
  }

  const voting = await blockApi.query.convictionVoting.votingFor.entries();
  const mapped = voting.map((item) => normalizeVotingForEntry(item));
  for (const { referendumIndex, trackId } of referenda) {
    const directVotes = extractDirectVotes(mapped, referendumIndex);
    const delegationVotes = extractDelegations(mapped, trackId, directVotes);
    await batchInsertReferendaVotes(referendumIndex, [
      ...populateQueryAt(directVotes, indexer),
      ...populateQueryAt(delegationVotes, indexer),
    ]);
    console.log(`Active referendum ${referendumIndex} votes inserted`);
  }
}

module.exports = {
  insertVotesForActiveReferenda,
};
