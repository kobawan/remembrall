const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
	name: String,
	amount: Number,
	type: String,
	size: Number,
});

const ToolModel = mongoose.model("Tool", ToolSchema);

module.exports = { ToolModel, ToolSchema };