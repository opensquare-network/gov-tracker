const {
  env: { currentChain },
} = require("@osn/scan-common");
const { addReferendaFinishedAt } = require("../../store");

const chainSectionMap = {};
const defaultSection = "referenda";

function getSectionByChain() {
  return chainSectionMap[currentChain()] || defaultSection;
}

function handleReferendaEvents(indexer, event) {
  const { section, method } = event;
  if (getSectionByChain() !== section) {
    return;
  }

  if (
    ["Confirmed", "Rejected", "TimedOut", "Cancelled", "Killed"].includes(
      method
    )
  ) {
    const referendumIndex = event.data[0].toNumber();
    addReferendaFinishedAt(indexer.blockHeight, referendumIndex);
  }
}

module.exports = {
  handleReferendaEvents,
};
