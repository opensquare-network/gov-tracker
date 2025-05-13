const votesMap = {};

function setVotes(height, votes) {
  votesMap[height] = votes;
}

function clearVotes(height) {
  delete votesMap[height];
}

function hasVotes(height) {
  return votesMap[height];
}

function getVotes(height) {
  return votesMap[height] || null;
}

module.exports = {
  setVotes,
  clearVotes,
  hasVotes,
  getVotes,
};
