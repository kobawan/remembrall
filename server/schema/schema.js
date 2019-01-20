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
		name: { type: GraphQLString },
		amount: { type: GraphQLInt },
	}),
});

const ToolType = new GraphQLObjectType({
	name: "Tool",
	fields: () => ({
		name: { type: GraphQLString },
		amount: { type: GraphQLInt },
		categories: { type: GraphQLList(GraphQLString) }
	}),
});

const CategoryType = new GraphQLObjectType({
	name: "Category",
	fields: () => ({
		name: { type: GraphQLString },
		tools: { type: GraphQLList(ToolType) },
	}),
});

const ProjectType = new GraphQLObjectType({
	name: "Project",
	fields: () => ({
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
		projects: { type: ProjectType },
		categories: { type: CategoryType },
		materials: { type: MaterialType },
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
			args: {
				id: { type: GraphQLID },
				projects: { type: ProjectType },
				categories: { type: CategoryType },
				materials: { type: MaterialType },
			},
			resolve(parent, args) {
				const user = new UserModel(args);
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
			},
			resolve(parent, args) {
				const material = new MaterialModel(args);
				return material.save();
			}
		},
		addTool: {
			type: ToolType,
			args: {
				name: { type: GraphQLString },
				amount: { type: GraphQLInt },
				categories: { type: GraphQLList(GraphQLString) }
			},
			resolve(parent, args) {
				const tool = new ToolModel(args);
				return tool.save();
			}
		},
		addCategory: {
			type: CategoryType,
			args: {
				name: { type: GraphQLString },
				tools: { type: GraphQLList(ToolType) },
			},
			resolve(parent, args) {
				const category = new CategoryModel(args);
				return category.save();
			}
		}
	}
})

module.exports = new GraphQLSchema({
	query: RootQuery,
	mutation: Mutation,
});
