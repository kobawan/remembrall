const UserModel = require("../models/user");
const { ProjectModel } = require("../models/project");
const { MaterialModel } = require("../models/material");
const { ToolModel } = require("../models/tool");
const { CategoryModel } = require("../models/category")

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
			return parent.categories.map(id => {
				return currentUser.categories.id(id)
			})
		},
		tools: async function(parent, args, { currentUser }) {
			return parent.tools.map(id => {
				return currentUser.tools.id(id)
			})
		},
		materials: async function(parent, args, { currentUser }) {
			return parent.materials.map(id => {
				return currentUser.materials.id(id)
			})
		},
	},
	Category: {
		tools: async function(parent, args, { currentUser }) {
			return parent.tools.map(toolID => {
				return currentUser.tools.id(toolID)
			})
		}
	},
	// MUTATIONS
	Mutation: {
		addProject: async function(
			parent,
			{ params: { name, instructions, notes, categories, materials, tools } },
			{ currentUser }
		) {
			const project = new ProjectModel({ name, instructions, notes, categories, materials, tools });
			await UserModel.update(
				{ _id: currentUser._id },
				{ $push: { projects: project } },
			);
			return project;
		},
		addMaterial: async function(
			parent,
			{ params: { name, amount, color } },
			{ currentUser }
		) {
			const material = new MaterialModel({ name, amount, color });
			await UserModel.update(
				{ _id: currentUser._id },
				{ $push: { materials: material } },
			);
			return material;
		},
		addTool: async function(
			parent,
			{ params: { name, amount } },
			{ currentUser }
		) {
			const tool = new ToolModel({ name, amount });
			await UserModel.update(
				{ _id: currentUser._id },
				{ $push: { tools: tool } },
			);
			return tool;
		},
		addCategory: async function(
			parent,
			{ params: { name, tools } },
			{ currentUser }
		) {
			const category = new CategoryModel({ name, tools });
			await UserModel.update(
				{ _id: currentUser._id },
				{ $push: { categories: category } },
			);
			return category;
		},
		addToolToCategory: async function(
			parent,
			{ params: { tool, category } },
			{ currentUser }
		) {
			const currentCategory = currentUser.categories.id(category);
			currentCategory.tools.push(tool);
			await currentUser.save();
			return currentCategory;
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
				entry.remove();
				await currentUser.save();
				return entry
			}
		},
		deleteTool: async function(parent, { id }, { currentUser }) {
			const entry = currentUser.tools.id(id);
			if(entry) {
				entry.remove();
				await currentUser.save();
				return entry
			}
		},
		deleteMaterial: async function(parent, { id }, { currentUser }) {
			const entry = currentUser.materials.id(id);
			if(entry) {
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
	},
};

module.exports = resolverMap;
