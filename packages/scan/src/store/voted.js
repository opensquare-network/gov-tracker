const votedMap = {};

function setVotedMark(height) {
  votedMap[height] = true;
}

function clearVotedMark(height) {
  delete votedMap[height];
}

function hasVotedMark(height) {
  return votedMap[height];
}

module.exports = {
  setVotedMark,
  clearVotedMark,
  hasVotedMark,
};
