const {
  normalizeVotingForEntry,
} = require("../../common/referenda/normalizeVotingForEntry");
const { extractDirectVotes } = require("../../common/referenda/direct");
const { extractDelegations } = require("../../common/referenda/delegation");
const { populateQueryAt } = require("../../common/referenda/common");
const {
  governance: { batchInsertReferendaVotes },
} = require("@gov-tracker/mongo");
const { getVotesAtBlock } = require("../../scan/jobs/getVotesAtBlock");

async function insertVotesForReferenda(referenda, indexer) {
  const votes = await getVotesAtBlock(indexer);
  const { referendumIndex, trackId } = referenda;
  const mapped = votes.map((item) => normalizeVotingForEntry(item));
  const directVotes = extractDirectVotes(mapped, referendumIndex);
  const delegationVotes = extractDelegations(mapped, trackId, directVotes);
  await batchInsertReferendaVotes(referendumIndex, [
    ...populateQueryAt(directVotes, indexer),
    ...populateQueryAt(delegationVotes, indexer),
  ]);
}

module.exports = {
  insertVotesForReferenda,
};
