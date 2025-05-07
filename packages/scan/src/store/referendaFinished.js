const finishedMap = {};

function addReferendaFinishedAt(blockHeight, referendumIndex) {
  const ids = finishedMap[blockHeight] || [];
  finishedMap[blockHeight] = [...new Set([...ids, referendumIndex])];
}

function getFinishedReferenda(blockHeight) {
  return finishedMap[blockHeight] || [];
}

function clearFinishedReferendaAt(blockHeight) {
  delete finishedMap[blockHeight];
}

module.exports = {
  addReferendaFinishedAt,
  getFinishedReferenda,
  clearFinishedReferendaAt,
};
