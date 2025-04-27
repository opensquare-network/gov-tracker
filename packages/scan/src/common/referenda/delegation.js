const { calcVotes } = require("./common");

function extractDelegations(mapped, track, directVotes = []) {
  const delegations = mapped
    .filter(({ trackId, voting }) => voting.isDelegating && trackId === track)
    .map(({ account, voting }) => {
      return {
        account,
        delegating: voting.asDelegating,
      };
    });

  return delegations.reduce((result, { account, delegating: { balance, conviction, target } }) => {
    const to = directVotes.find(({ account, isStandard }) => account === target.toString() && isStandard);
    if (!to) {
      return result;
    }

    const value = balance.toBigInt().toString();
    const convictionValue = conviction.toNumber();

    return [
      ...result,
      {
        account,
        target: target.toString(),
        isDelegating: true,
        isStandard: false,
        isSplit: false,
        isSplitAbstain: false,
        balance: value,
        aye: to.aye,
        conviction: convictionValue,
        votes: calcVotes(value, convictionValue),
      },
    ];
  }, []);
}

module.exports = {
  extractDelegations,
};
