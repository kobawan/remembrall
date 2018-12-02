const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
    name: String,
    amount: Number,
});

const MaterialModel = mongoose.model("Material", ResourceSchema);
const ToolModel = mongoose.model("Tool", ResourceSchema);

module.exports = { MaterialModel, ToolModel, ResourceSchema };