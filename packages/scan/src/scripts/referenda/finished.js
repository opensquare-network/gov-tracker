const {
  chain: { findBlockApi },
} = require("@osn/scan-common");
const { getIndexerByHeight } = require("../common/indexer");
const {
  governance: { getReferendaVoteCol },
} = require("@gov-tracker/mongo");
const { insertVotesForReferenda } = require("./common");

async function alreadyHasVotes(referendumIndex) {
  const col = await getReferendaVoteCol();
  const votesCount = await col.count({ referendumIndex });
  return votesCount > 0;
}

async function getTrackId(api, referendumIndex, height) {
  const blockHash = await api.rpc.chain.getBlockHash(height);
  const blockApi = await findBlockApi(blockHash);
  const optionInfo = await blockApi.query.referenda.referendumInfoFor(
    referendumIndex
  );
  const info = optionInfo.unwrap();
  if (!info.isOngoing) {
    throw new Error(
      `Referendum ${referendumIndex} should be ongoing at ${height}`
    );
  }

  return info.asOngoing.track.toNumber();
}

async function saveVotesForOneFinishedReferendum(api, referendumObj = {}) {
  const { referendumIndex, voteFinishedHeight } = referendumObj;
  if (!voteFinishedHeight) {
    throw new Error(
      `No vote finished height for referendum ${referendumIndex}`
    );
  }

  const handled = await alreadyHasVotes(referendumIndex);
  if (handled) {
    console.log(`Finished referendum ${referendumIndex} already handled`);
    return;
  }

  const trackId = await getTrackId(
    api,
    referendumIndex,
    voteFinishedHeight - 1
  );
  const indexer = await getIndexerByHeight(api, voteFinishedHeight);

  await insertVotesForReferenda({ referendumIndex, trackId }, indexer);
  console.log(`Finished referendum ${referendumIndex} votes inserted`);
}

async function updateVotesForOneFinishedReferendum(api, referendumObj = {}) {
  const { referendumIndex, voteFinishedHeight } = referendumObj;
  if (!voteFinishedHeight) {
    throw new Error(
      `No vote finished height for referendum ${referendumIndex}`
    );
  }

  const trackId = await getTrackId(
    api,
    referendumIndex,
    voteFinishedHeight - 1
  );
  const indexer = await getIndexerByHeight(api, voteFinishedHeight);

  await insertVotesForReferenda({ referendumIndex, trackId }, indexer);
  console.log(`Finished referendum ${referendumIndex} votes inserted`);
}

module.exports = {
  saveVotesForOneFinishedReferendum,
  updateVotesForOneFinishedReferendum,
  alreadyHasVotes,
};
