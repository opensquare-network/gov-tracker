const { getPreimageCol } = require("@gov-tracker/mongo/src/governance");

async function preimages(_, _args) {
  const { hash, len } = _args;
  let q = {};
  if (hash) {
    q = { hash };
    if (len) {
      q = { hash, len };
    }
  }

  const col = await getPreimageCol();
  return await col.find(q, { projection: { _id: 0 } }).toArray();
}

module.exports = {
  preimages,
};
