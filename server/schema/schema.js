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
		categories: { type: GraphQLList(GraphQLString) },
	}),
});

const CategoryType = new GraphQLObjectType({
	name: "Category",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		tools: { type: GraphQLList(ToolType) },
	}),
});

const ProjectType = new GraphQLObjectType({
	name: "Project",
	fields: () => ({
		id: { type: GraphQLID },
		name: { type: GraphQLString },
		instructions: { type: GraphQLString },
		notes: { type: GraphQLString },
		categories: { type: GraphQLList(CategoryType) },
		materials: { type: GraphQLList(MaterialType) },
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

const RootQuery = new GraphQLObjectType({
	name: "RootQuery",
	fields: {
		user: {
			type: UserType,
			args: {
				id: { type: GraphQLID },
			},
			resolve: (parent, args) => UserModel.findById(args.id),
		},
	},
});

const Mutation = new GraphQLObjectType({
	name: "Mutation",
	fields: {
		addUser: {
			type: UserType,
			resolve() {
				const user = new UserModel();
				return user.save();
			}
		},
		// addProject: {
		// 	type: ProjectType,
		// 	args: {
		// 	name: { type: GraphQLString },
		// 	instructions: { type: GraphQLString },
		// 	notes: { type: GraphQLString },
		// 	categories: { type: GraphQLList(CategoryType) },
		// 	materials: { type: GraphQLList(MaterialType) },
		// },
		// 	resolve(parent, args) {
		// 		const project = new ProjectModel(args);
		// 		return project.save();
		// 	}
		// }
		addMaterial: {
			type: MaterialType,
			args: {
				name: { type: GraphQLString },
				amount: { type: GraphQLInt },
				userId: { type: GraphQLID },
			},
			async resolve(parent, { name, amount, userId }) {
				const material = new MaterialModel({
					name,
					amount,
				});
				await UserModel.update(
					{ _id: userId },
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
				categories: { type: GraphQLList(GraphQLString) },
				userId: { type: GraphQLID },
			},
			async resolve(parent, { name, amount, categories, userId }) {
				const tool = new ToolModel({ name, amount, categories });
				await UserModel.update(
					{ _id: userId },
					{ $push: { tools: tool } },
				);
				return tool;
			}
		},
		// addCategory: {
		// 	type: CategoryType,
		// 	args: {
		// 		name: { type: GraphQLString },
		// 		tools: { type: GraphQLList(ToolType) },
		// 	},
		// 	resolve(parent, args) {
		// 		const category = new CategoryModel(args);
		// 		return category.save();
		// 	}
		// }
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
