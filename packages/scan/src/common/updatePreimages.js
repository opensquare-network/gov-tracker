const { getPreimageCol } = require("@gov-tracker/mongo/src/governance");
const {
  chain: { getApi },
} = require("@osn/scan-common");

function getPreimageHashAndStatus(requestStatus) {
  const [{ args }, optStatus] = requestStatus;
  const hash = args[0].toJSON();
  const status = optStatus.toJSON();
  return {
    hash,
    ...status,
  };
}

async function getPreimageHex(hash, len) {
  const api = await getApi();
  const preimage = await api.query.preimage.preimageFor([hash, len]);
  return preimage.toHex();
}

async function getPreimage(requestStatus) {
  const { hash, ...others } = getPreimageHashAndStatus(requestStatus);
  const len = others.unrequested?.len || others.requested?.maybeLen;
  const hex = await getPreimageHex(hash, len);
  return {
    hash,
    ...others,
    hex,
  };
}

async function savePreimages(preimages) {
  const preimageCol = await getPreimageCol();
  await preimageCol.deleteMany({
    hash: { $nin: preimages.map((p) => p.hash) },
  });
  const bulk = preimageCol.initializeUnorderedBulkOp();
  for (const { hash, ...others } of preimages) {
    bulk.find({ hash }).upsert().updateOne({
      $set: others,
    });
  }
  await bulk.execute();
}

async function updateAllPreimages() {
  const api = await getApi();
  const requestStatuses = await api.query.preimage.requestStatusFor.entries();
  const preimages = await Promise.all(
    requestStatuses.map((requestStatus) => getPreimage(requestStatus))
  );
  await savePreimages(preimages);
}

module.exports = {
  getPreimageHashAndStatus,
  getPreimageHex,
  updateAllPreimages,
};
