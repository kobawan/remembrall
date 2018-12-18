const {
	GraphQLObjectType,
	GraphQLSchema,
	GraphQLID,
	GraphQLString,
	GraphQLInt,
} = require("graphql");
const UserModel = require("../models/user");

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
	}),
});

const CategoryType = new GraphQLObjectType({
	name: "Category",
	fields: () => ({
		name: { type: GraphQLString },
    	tools: { type: ToolType },
	}),
});

const ProjectType = new GraphQLObjectType({
	name: "Project",
	fields: () => ({
		name: { type: GraphQLString },
		instructions: { type: GraphQLString },
		notes: { type: GraphQLString },
		categories: { type: CategoryType },
		materials: { type: MaterialType },
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

module.exports = new GraphQLSchema({
	query: RootQuery,
});
