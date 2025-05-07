const {
  env: { currentChain },
} = require("@osn/scan-common");
const { setVotedMark } = require("../../store");

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
  }
}

module.exports = {
  handleVoteEvents,
};
