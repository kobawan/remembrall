const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    name: String,
    tools: [String],
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = { CategoryModel, CategorySchema };