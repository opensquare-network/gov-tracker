const {
  env: { currentChain },
} = require("@osn/scan-common");
const { addPreimageHash } = require("../../store/preimage");

const chainSectionMap = {};
const defaultSection = "preimage";

function getSectionByChain() {
  return chainSectionMap[currentChain()] || defaultSection;
}

function handlePreimageEvents(indexer, event) {
  const { section, method } = event;
  if (getSectionByChain() !== section) {
    return;
  }

  if (["Noted", "Cleared"].includes(method)) {
    const preimageHash = event.data[0].toString();
    addPreimageHash(indexer.blockHeight, preimageHash);
  }
}

module.exports = {
  handlePreimageEvents,
};
