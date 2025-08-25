const { getPreimageCol } = require("@gov-tracker/mongo/src/governance");
const {
  chain: { getApi },
} = require("@osn/scan-common");

function getPreimageHashAndLen(requestStatus) {
  const [{ args }, optStatus] = requestStatus;
  const hash = args[0].toJSON();

  let len = null;
  const status = optStatus.unwrapOr(null);
  if (status.isRequested) {
    len = status.asRequested.maybeLen.unwrapOr(null)?.toNumber();
  } else if (status.isUnrequested) {
    len = status.asUnrequested.len.toNumber();
  }

  return {
    hash,
    len,
  };
}

async function getPreimageHex(hash, len) {
  const api = await getApi();
  const preimage = await api.query.preimage.preimageFor([hash, len]);
  return preimage.toHex();
}

async function getPreimage(requestStatus) {
  const { hash, len } = getPreimageHashAndLen(requestStatus);
  const hex = await getPreimageHex(hash, len);
  return {
    hash,
    len,
    hex,
  };
}

async function savePreimages(preimages) {
  const preimageCol = await getPreimageCol();
  await preimageCol.deleteMany({
    hash: { $nin: preimages.map((p) => p.hash) },
  });
  const bulk = preimageCol.initializeUnorderedBulkOp();
  for (const { hash, len, hex } of preimages) {
    bulk.find({ hash }).upsert().updateOne({
      $set: {
        len,
        hex,
      },
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
  getPreimageHashAndLen,
  getPreimageHex,
  updateAllPreimages,
};
