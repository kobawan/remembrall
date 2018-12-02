const mongoose = require('mongoose');
const CategorySchema = require('./category').CategorySchema;
const ResourceSchema = require('./resource').ResourceSchema;

const ProjectSchema = new mongoose.Schema({
    name: String,
    instructions: String,
    notes: String,
    categories: [CategorySchema],
    materials: [ResourceSchema],
});

const ProjectModel = mongoose.model("Project", ProjectSchema);

module.exports = { ProjectModel, ProjectSchema };