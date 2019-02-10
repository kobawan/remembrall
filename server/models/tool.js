const mongoose = require('mongoose');

const ToolSchema = new mongoose.Schema({
    name: String,
    amount: Number,
});

const ToolModel = mongoose.model("Tool", ToolSchema);

module.exports = { ToolModel, ToolSchema };