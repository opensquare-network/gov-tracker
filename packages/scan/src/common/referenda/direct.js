const { calcVotes } = require("./common");

function extractStandardVote(account, vote, delegations) {
  const standard = vote.asStandard;
  const balance = standard.balance.toBigInt().toString();
  const conviction = standard.vote.conviction.toNumber();

  return {
    account,
    isDelegating: false,
    isStandard: true,
    isSplit: false,
    isSplitAbstain: false,
    balance,
    aye: standard.vote.isAye,
    conviction: standard.vote.conviction.toNumber(),
    votes: calcVotes(balance, conviction),
    delegations: {
      votes: delegations.votes.toString(),
      capital: delegations.capital.toString(),
    }
  };
}

function extractSplitVote(account, vote) {
  const split = vote.asSplit;
  const ayeBalance = split.aye.toBigInt().toString();
  const nayBalance = split.nay.toBigInt().toString();

  return {
    account,
    isDelegating: false,
    isStandard: false,
    isSplit: true,
    isSplitAbstain: false,
    conviction: 0,
    ayeBalance: ayeBalance,
    ayeVotes: calcVotes(ayeBalance, 0),
    nayBalance: nayBalance,
    nayVotes: calcVotes(nayBalance, 0),
  };
}

function extractSplitAbstainVote(account, vote) {
  const splitAbstain = vote.asSplitAbstain;
  const ayeBalance = splitAbstain.aye.toBigInt().toString();
  const nayBalance = splitAbstain.nay.toBigInt().toString();
  const abstainBalance = splitAbstain.abstain.toBigInt().toString();

  return {
    account,
    isDelegating: false,
    isStandard: false,
    isSplit: false,
    isSplitAbstain: true,
    conviction: 0,
    abstainBalance: abstainBalance,
    abstainVotes: calcVotes(abstainBalance, 0),
    ayeBalance: ayeBalance,
    ayeVotes: calcVotes(ayeBalance, 0),
    nayBalance: nayBalance,
    nayVotes: calcVotes(nayBalance, 0),
  };
}

function extractDirectVotes(mapped, targetReferendumIndex) {
  return mapped
    .filter(({ voting }) => voting.isCasting)
    .map(({ account, voting }) => {
      return {
        account,
        votes: voting.asCasting.votes.filter(([idx]) =>
          idx.eq(targetReferendumIndex),
        ),
        delegations: voting.asCasting.delegations,
      };
    })
    .filter(({ votes }) => votes.length > 0)
    .map(({ account, votes, delegations }) => {
      return {
        account,
        vote: votes[0][1],
        delegations,
      };
    })
    .reduce((result, { account, vote, delegations }) => {
      if (vote.isStandard) {
        result.push(extractStandardVote(account, vote, delegations));
      } else if (vote.isSplit) {
        result.push(extractSplitVote(account, vote));
      } else if (vote.isSplitAbstain) {
        result.push(extractSplitAbstainVote(account, vote));
      }

      return result;
    }, []);
}

module.exports = {
  extractDirectVotes,
};
