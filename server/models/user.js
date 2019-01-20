const mongoose = require('mongoose');
const { ProjectSchema } =  require('./project');
const { CategorySchema } = require('./category');
const { MaterialSchema } = require('./material');

const UserSchema = new mongoose.Schema({
    user: {
        projects: [ProjectSchema],
        categories: [CategorySchema],
        materials: [MaterialSchema],
    },
});

const UserModel = mongoose.model("User", UserSchema);

module.exports = UserModel;