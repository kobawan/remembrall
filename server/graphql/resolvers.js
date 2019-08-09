const UserModel = require("../models/user");
const { ProjectModel } = require("../models/project");
const { MaterialModel } = require("../models/material");
const { ToolModel } = require("../models/tool");
const { CategoryModel } = require("../models/category");
const { encryptString, compareEncryptedString } = require("../utils/password");

const resolverMap = {
	// QUERIES
	Query: {
		user(parent, args, { currentUser }) {
			return currentUser;
		},
		projects(parent, args, { currentUser }) {
			return currentUser.projects;
		},
		categories(parent, args, { currentUser }) {
			return currentUser.categories;
		},
		tools(parent, args, { currentUser }) {
			return currentUser.tools;
		},
		materials(parent, args, { currentUser }) {
			return currentUser.materials;
		},
	},
	// QUERY HELPERS
	Project: {
		categories: async function(parent, args, { currentUser }) {
			return parent.categories
				.map(id => currentUser.categories.id(id))
				.filter(res => res !== null)
		},
		tools: async function(parent, args, { currentUser }) {
			return parent.tools
				.map(id => currentUser.tools.id(id))
				.filter(res => res !== null)
		},
		materials: async function(parent, args, { currentUser }) {
			return parent.materials
				.map(id => currentUser.materials.id(id))
				.filter(res => res !== null)
		},
	},
	// MUTATIONS
	Mutation: {
		loginUser: async function(parent, { email, password }) {
			const user = await UserModel.findOne({ email });
			if(!user) {
				return null;
			}
			const res = await compareEncryptedString(password, user.password);
			if(!res) {
				return null;
			}

			return user;
		},
		addUser: async function(parent, { email, password }) {
			const hash = await encryptString(password);
			const user = new UserModel({ email, password: hash });
			await user.save();
			return user;
		},
		addProject: async function(parent, { params }, { currentUser }) {
			const project = new ProjectModel(params);
			await UserModel.update(
				{ _id: currentUser._id },
				{ $push: { projects: project } },
			);
			return project;
		},
		addMaterial: async function(parent, { params }, { currentUser }) {
			const material = new MaterialModel(params);
			await UserModel.update(
				{ _id: currentUser._id },
				{ $push: { materials: material } },
			);
			return material;
		},
		addTool: async function(parent, { params }, { currentUser }) {
			const tool = new ToolModel(params);
			await UserModel.update(
				{ _id: currentUser._id },
				{ $push: { tools: tool } },
			);
			return tool;
		},
		addCategory: async function(parent, { params }, { currentUser }) {
			const category = new CategoryModel(params);
			await UserModel.update(
				{ _id: currentUser._id },
				{ $push: { categories: category } },
			);
			return category;
		},
		deleteProject: async function(parent, { id }, { currentUser }) {
			const entry = currentUser.projects.id(id);
			if(entry) {
				entry.remove();
				await currentUser.save();
				return entry
			}
		},
		deleteCategory: async function(parent, { id }, { currentUser }) {
			const entry = currentUser.categories.id(id);
			if(entry) {
				currentUser.projects.forEach(({ categories }) => {
					categories = categories.filter(categoryId => categoryId !== id)
				})
				entry.remove();
				await currentUser.save();
				return entry
			}
		},
		deleteTool: async function(parent, { id }, { currentUser }) {
			const entry = currentUser.tools.id(id);
			if(entry) {
				currentUser.projects.forEach(({ tools }) => {
					tools = tools.filter(toolId => toolId !== id)
				})
				entry.remove();
				await currentUser.save();
				return entry
			}
		},
		deleteMaterial: async function(parent, { id }, { currentUser }) {
			const entry = currentUser.materials.id(id);
			if(entry) {
				currentUser.projects.forEach(({ materials }) => {
					materials = materials.filter(materialId => materialId !== id)
				})
				entry.remove();
				await currentUser.save();
				return entry
			}
		},
		updateProject: async function(parent, { id, params }, { currentUser }) {
			const project = currentUser.projects.id(id);
			if(project) {
				Object.entries(params).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						project[key] = value;
					}
				});

				await currentUser.save();
				return project;
			}
		},
		updateCategory: async function(parent, { id, params }, { currentUser }) {
			const category = currentUser.categories.id(id);
			if(category) {
				Object.entries(params).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						category[key] = value;
					}
				});

				await currentUser.save();
				return category;
			}
		},
		updateTool: async function(parent, { id, params }, { currentUser }) {
			const tool = currentUser.tools.id(id);
			if(tool) {
				Object.entries(params).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						tool[key] = value;
					}
				});

				await currentUser.save();
				return tool;
			}
		},
		updateMaterial: async function(parent, { id, params }, { currentUser }) {
			const material = currentUser.materials.id(id);
			if(material) {
				Object.entries(params).forEach(([key, value]) => {
					if (value !== undefined && value !== null) {
						material[key] = value;
					}
				});

				await currentUser.save();
				return material;
			}
		},
	},
};

module.exports = resolverMap;
