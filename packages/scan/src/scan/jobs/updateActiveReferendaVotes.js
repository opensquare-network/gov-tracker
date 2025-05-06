const {
  chain: { getApi },
} = require("@osn/scan-common");
const { getNormalizedReferenda } = require("../query/referenda");
const {
  insertVotesForActiveReferenda,
} = require("../../scripts/referenda/active");

async function updateActiveReferendaVotes(indexer) {
  const api = await getApi();
  const referenda = await getNormalizedReferenda(indexer);
  const activeReferenda = referenda.filter((r) => r.isActive);
  await insertVotesForActiveReferenda(api, activeReferenda, indexer);
}

module.exports = {
  updateActiveReferendaVotes,
};
