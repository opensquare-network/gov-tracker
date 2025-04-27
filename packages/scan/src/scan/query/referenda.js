const {
  chain: { findBlockApi },
} = require("@osn/scan-common");

async function getAllReferendaEntries(indexer) {
  const blockApi = await findBlockApi(indexer.blockHash);
  return await blockApi.query.referenda.referendumInfoFor.entries();
}

async function getNormalizedReferenda(indexer) {
  const entries = await getAllReferendaEntries(indexer);
  return entries.map(([storageKey, optionalStorage]) => {
    const referendumIndex = storageKey.args[0].toNumber();
    const unwrapped = optionalStorage.unwrap();
    const isActive = unwrapped.isOngoing;
    let trackId = null;
    let voteFinishedHeight = null;
    if (unwrapped.isApproved) {
      voteFinishedHeight = unwrapped.asApproved[0].toNumber();
    } else if (unwrapped.isOngoing) {
      trackId = unwrapped.asOngoing.track.toNumber();
    } else if (unwrapped.isRejected) {
      voteFinishedHeight = unwrapped.asRejected[0].toNumber();
    } else if (unwrapped.isTimedOut) {
      voteFinishedHeight = unwrapped.asTimedOut[0].toNumber();
    } else if (unwrapped.isKilled) {
      voteFinishedHeight = unwrapped.asKilled.toNumber();
    } else if (unwrapped.isCancelled) {
      voteFinishedHeight = unwrapped.asCancelled[0].toNumber();
    }

    return {
      referendumIndex,
      trackId,
      isActive,
      voteFinishedHeight,
    };
  });
}

module.exports = {
  getAllReferendaEntries,
  getNormalizedReferenda,
};
