const preimageMap = {};

function addPreimageHash(blockHeight, preimageHash) {
  const ids = preimageMap[blockHeight] || [];
  preimageMap[blockHeight] = [...new Set([...ids, preimageHash])];
}

function getPreimageHashes(blockHeight) {
  return preimageMap[blockHeight] || [];
}

function clearPreimageHashesAt(blockHeight) {
  delete preimageMap[blockHeight];
}

module.exports = {
  addPreimageHash,
  getPreimageHashes,
  clearPreimageHashesAt,
};
