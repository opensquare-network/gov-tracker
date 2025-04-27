const scanStep = parseInt(process.env.SCAN_STEP) || 100;

function getScanStep() {
  return scanStep;
}

module.exports = {
  getScanStep,
};
