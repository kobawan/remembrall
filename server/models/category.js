const mongoose = require('mongoose');
const ResourceSchema = require('./resource').ResourceSchema;

const CategorySchema = new mongoose.Schema({
    name: String,
    tools: [ResourceSchema],
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = { CategoryModel, CategorySchema };