const mongoose = require('mongoose');
const ProjectSchema =  require('./project').ProjectSchema;
const CategorySchema = require('./category').CategorySchema;
const ResourceSchema = require('./resource').ResourceSchema;

const UserSchema = new mongoose.Schema({
    user: {
        projects: [ProjectSchema],
        categories: [CategorySchema],
        materials: [ResourceSchema],
    },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;