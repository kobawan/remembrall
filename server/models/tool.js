const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
	name: String,
	amount: Number,
	type: String,
	size: String,
});

const ToolModel = mongoose.model("Tool", ToolSchema);

module.exports = { ToolModel, ToolSchema };