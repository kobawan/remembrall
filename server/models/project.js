const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
	name: String,
	instructions: String,
	notes: String,
	categories: [String],
	materials: [{ id: String, amountUsed: Number }],
	tools: [{ id: String, amountUsed: Number }],
});

const ProjectModel = mongoose.model("Project", ProjectSchema);

module.exports = { ProjectModel, ProjectSchema };