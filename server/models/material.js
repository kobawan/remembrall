const mongoose = require('mongoose');

const MaterialSchema = new mongoose.Schema({
    name: String,
    amount: Number,
});

const MaterialModel = mongoose.model("Material", MaterialSchema);

module.exports = { MaterialModel, MaterialSchema };