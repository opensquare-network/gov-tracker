const {
  governance: { getGovScanDb },
} = require("@gov-tracker/mongo");
const {
  chain: { getLatestUnFinalizedHeight, fetchBlocks },
  utils: { sleep },
  logger,
} = require("@osn/scan-common");
const { getScanStep } = require("../common/env");
const { handleBlock } = require("./block");

function getTargetHeight(startHeight) {
  const chainHeight = getLatestUnFinalizedHeight();

  let targetHeight = chainHeight;
  const step = getScanStep();
  if (startHeight + step < chainHeight) {
    targetHeight = startHeight + step;
  }

  return targetHeight;
}

function getHeights(start, end) {
  const heights = [];
  for (let i = start; i <= end; i++) {
    heights.push(i);
  }

  return heights;
}

async function scanGov() {
  const db = await getGovScanDb();
  let scanHeight = await db.getScanHeight();
  /*eslint no-constant-condition: ["error", { "checkLoops": false }]*/
  while (true) {
    const chainHeight = getLatestUnFinalizedHeight();
    if (scanHeight > chainHeight) {
      await sleep(1000);
      continue;
    }

    const targetHeight = getTargetHeight(scanHeight);
    const heights = getHeights(scanHeight, targetHeight);
    const blocks = await fetchBlocks(heights);
    for (const { height, block, events } of blocks) {
      await handleBlock(block, events);
      console.log(`block ${height} done`);

      if (height % 80000 === 0) {
        process.exit(0);
      }
    }

    const startHeight = blocks[0].height;
    const destHeight = blocks[(blocks || []).length - 1].height;
    logger.info(`blocks ${startHeight}-${destHeight} done`);
    scanHeight = destHeight + 1;
    await sleep(1);
  }
}

module.exports = {
  scanGov,
};
