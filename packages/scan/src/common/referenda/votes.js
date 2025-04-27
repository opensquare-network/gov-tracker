const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const { normalizeVotingForEntry } = require("./normalizeVotingForEntry");
const { extractDirectVotes } = require("./direct");
const { extractDelegations } = require("./delegation");
const { governance: { batchInsertReferendaVotes } } = require("@gov-tracker/mongo");
const { populateQueryAt } = require("./common");

async function insertReferendaVotes(referendumIndex, trackId, indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  if (!blockApi.query.convictionVoting?.votingFor) {
    return;
  }

  const voting = await blockApi.query.convictionVoting.votingFor.entries();
  const mapped = voting.map((item) => normalizeVotingForEntry(item));
  const directVotes = extractDirectVotes(mapped, referendumIndex);
  const delegationVotes = extractDelegations(mapped, trackId, directVotes);

  await batchInsertReferendaVotes(referendumIndex, [
    ...populateQueryAt(directVotes, indexer),
    ...populateQueryAt(delegationVotes, indexer),
  ]);
}

module.exports = {
  insertReferendaVotes,
};
