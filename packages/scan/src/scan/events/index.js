const { handleVoteEvents } = require("./convictionVoting");

async function handleEvents(events = [], blockIndexer) {
  for (let eventIndex = 0; eventIndex < events.length; eventIndex++) {
    let indexer = { ...blockIndexer, eventIndex };
    const { event, phase } = events[eventIndex];
    if (!phase.isNone) {
      const extrinsicIndex = phase.value.toNumber();
      indexer = { ...indexer, extrinsicIndex };
    }

    await handleVoteEvents(indexer, event);
  }
}

module.exports = {
  handleEvents,
};
