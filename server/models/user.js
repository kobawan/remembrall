const mongoose = require('mongoose');
const { ProjectSchema } =  require('./project');
const { CategorySchema } = require('./category');
const { MaterialSchema } = require('./material');
const { ToolSchema } = require('./tool');

const UserSchema = new mongoose.Schema({
	email: String,
	password: String,
	projects: [ProjectSchema],
	categories: [CategorySchema],
	materials: [MaterialSchema],
	tools: [ToolSchema],
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;