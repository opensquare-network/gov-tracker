const {
  env: { currentChain },
} = require("@osn/scan-common");
const { setVotedMark, addReferendaFinishedAt } = require("../../store");

const chainSectionMap = {};
const defaultSection = "convictionVoting";

function getSectionByChain() {
  return chainSectionMap[currentChain()] || defaultSection;
}

function handleVoteEvents(indexer, event) {
  const { section, method } = event;
  if (getSectionByChain() !== section) {
    return;
  }

  if (["Voted", "VoteRemoved", "Delegated", "Undelegated"].includes(method)) {
    setVotedMark(indexer.blockHeight);
  } else if (["Confirmed", "Rejected", "TimedOut", "Cancelled", "Killed"].includes(method)) {
    const referendumIndex = event.data[0].toNumber();
    addReferendaFinishedAt(indexer.blockHeight, referendumIndex);
  }
}

module.exports = {
  handleVoteEvents,
};
