const mongoose = require('mongoose');
const { ToolSchema } = require('./tool');

const CategorySchema = new mongoose.Schema({
    name: String,
    tools: [ToolSchema],
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = { CategoryModel, CategorySchema };