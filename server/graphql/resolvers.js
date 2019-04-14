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
	},
	// QUERY HELPERS
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
	},
};

module.exports = resolverMap;
