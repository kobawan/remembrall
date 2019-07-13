const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
	name: String,
	inProjects: [String],
});

const CategoryModel = mongoose.model("Category", CategorySchema);

module.exports = { CategoryModel, CategorySchema };