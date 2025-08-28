const { getPreimageHashes } = require("../../store");
const { updateAllPreimages } = require("../../common/updatePreimages");

async function updatePreimages(blockIndexer) {
  const preimageHashes = getPreimageHashes(blockIndexer.blockHeight);
  if (!preimageHashes || preimageHashes.length === 0) {
    return;
  }
  await updateAllPreimages();
}

module.exports = {
  updatePreimages,
};
