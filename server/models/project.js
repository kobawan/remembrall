const mongoose = require('mongoose');
const { CategorySchema } = require('./category');
const { MaterialSchema } = require('./material');

const ProjectSchema = new mongoose.Schema({
    name: String,
    instructions: String,
    notes: String,
    categories: [CategorySchema],
    materials: [MaterialSchema],
});

const ProjectModel = mongoose.model("Project", ProjectSchema);

module.exports = { ProjectModel, ProjectSchema };