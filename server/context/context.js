const UserModel = require("../models/user");

async function context(req) {
  const authToken = req.headers.authorization;
  let currentUser = null;

  if (authToken) {
    currentUser = await UserModel.findById(authToken)
  } else {
    console.warn(`Unable to authenticate using auth token: ${authToken}`);
    currentUser = new UserModel();
    await currentUser.save();
  }

  return { currentUser };
};

module.exports = context;
