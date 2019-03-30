const {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLID,
	GraphQLString,
	GraphQLInt,
	GraphQLList,
} = require("graphql");
const UserModel = require("../models/user");
const { ProjectModel } = require("../models/project");
const { MaterialModel } = require("../models/material");
const { ToolModel } = require("../models/tool");
const { CategoryModel } = require("../models/category")

const MaterialType = new GraphQLObjectType({
	name: "Material",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		amount: { type: GraphQLInt },
	}),
});

const ToolType = new GraphQLObjectType({
	name: "Tool",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		amount: { type: GraphQLInt },
	}),
});

const CategoryType = new GraphQLObjectType({
	name: "Category",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		tools: {
			type: GraphQLList(ToolType),
			async resolve(parent, args, { currentUser }) {
				return currentUser.tools.filter(({ _id }) => parent.tools.includes(`${_id}`));
			}
		},
	}),
});

const ProjectType = new GraphQLObjectType({
	name: "Project",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		instructions: { type: GraphQLString },
		notes: { type: GraphQLString },
		categories: {
			type: GraphQLList(CategoryType),
			async resolve(parent, args, { currentUser }) {
				return currentUser.categories.filter(({ _id }) => parent.categories.includes(`${_id}`));
			}
		},
		materials: {
			type: GraphQLList(MaterialType),
			async resolve(parent, args, { currentUser }) {
				return currentUser.materials.filter(({ _id }) => parent.materials.includes(`${_id}`));
			}
		},
		tools: {
			type: GraphQLList(ToolType),
			async resolve(parent, args, { currentUser }) {
				return currentUser.tools.filter(({ _id }) => parent.tools.includes(`${_id}`));
			}
		},
	}),
});

const UserType = new GraphQLObjectType({
	name: "User",
	fields: () => ({
		id: { type: GraphQLID },
		projects: { type: GraphQLList(ProjectType) },
		categories: { type: GraphQLList(CategoryType) },
		materials: { type: GraphQLList(MaterialType) },
		tools: { type: GraphQLList(ToolType) },
	}),
});

const Query = new GraphQLObjectType({
	name: "Query",
	fields: {
		user: {
			type: UserType,
			resolve(parent, args, { currentUser }) {
				return currentUser;
			},
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addProject: {
			type: ProjectType,
			args: {
				name: { type: GraphQLString },
				instructions: { type: GraphQLString },
				notes: { type: GraphQLString },
				categories: { type: GraphQLList(GraphQLID) },
				materials: { type: GraphQLList(GraphQLID) },
				tools: { type: GraphQLList(GraphQLID) },
			},
			async resolve(parent, { name, instructions, notes, categories, materials, tools }, { currentUser }) {
				const project = new ProjectModel({ name, instructions, notes, categories, materials, tools });
				await UserModel.update(
					{ _id: currentUser._id },
					{ $push: { projects: project } },
				);
				return project;
			}
		},
		addMaterial: {
			type: MaterialType,
			args: {
				name: { type: GraphQLString },
				amount: { type: GraphQLInt },
			},
			async resolve(parent, { name, amount }, { currentUser }) {
				const material = new MaterialModel({ name, amount });
				await UserModel.update(
					{ _id: currentUser._id },
					{ $push: { materials: material } },
				);
				return material;
			}
		},
		addTool: {
			type: ToolType,
			args: {
				name: { type: GraphQLString },
				amount: { type: GraphQLInt },
			},
			async resolve(parent, { name, amount }, { currentUser }) {
				const tool = new ToolModel({ name, amount });
				await UserModel.update(
					{ _id: currentUser._id },
					{ $push: { tools: tool } },
				);
				return tool;
			}
		},
		addCategory: {
			type: CategoryType,
			args: {
				name: { type: GraphQLString },
				tools: { type: GraphQLList(GraphQLID) },
			},
			async resolve(parent, { name, tools }, { currentUser }) {
				const category = new CategoryModel({ name, tools });
				await UserModel.update(
					{ _id: currentUser._id },
					{ $push: { categories: category } },
				);
				return category;
			}
		},
		addToolToCategory: {
			type: CategoryType,
			args: {
				toolId: { type: GraphQLID },
				categoryId: { type: GraphQLID },
			},
			async resolve(parent, { toolId, categoryId }, { currentUser }) {
				const category = currentUser.categories.id(categoryId);
				category.tools.push(toolId);
				await currentUser.save();
				return category;
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: Query,
	mutation: Mutation,
});
