const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
    name: String,
    instructions: String,
    notes: String,
    categories: [String],
    materials: [String],
    tools: [String],
});

const ProjectModel = mongoose.model("Project", ProjectSchema);

module.exports = { ProjectModel, ProjectSchema };