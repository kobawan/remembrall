const UserModel = require("../models/user");

async function context(req) {
	const authToken = (req.headers && req.headers.authorization) || '';
	let currentUser = null;

	if (authToken) {
		currentUser = await UserModel.findById(authToken)
	}

	return { currentUser };
};

module.exports = context;
