function normalizeVotingForEntry([storageKey, voting]) {
  const address = storageKey.args[0].toString();
  const trackId = storageKey.args[1].toNumber();
  return { account: address, trackId, voting };
}

module.exports = {
  normalizeVotingForEntry,
};
