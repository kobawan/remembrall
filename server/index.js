const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const mongoose = require('mongoose');
const graphqlHTTP = require("express-graphql");
const { makeExecutableSchema } = require('graphql-tools');
const context = require("./graphql/context");
const resolversMap = require("./graphql/resolvers");

// Creating express app
const app = express();
const PORT = process.env.PORT || 4000;
app.use(cors());

// Connecting to database
mongoose.connect(
	"mongodb://kobawan:fpfSywHN8pnQpT7@ds137661.mlab.com:37661/remembrall",
	{ useNewUrlParser: true },
)
mongoose.connection.once("open", () => {
	console.log("Connected to Database 🚦")
});

// Setting up graphql
const schemaFile = path.join(__dirname, 'graphql', 'schema.gql');
const typeDefs = fs.readFileSync(schemaFile, 'utf8');
const schema = makeExecutableSchema({
	typeDefs,
	resolvers: resolversMap,
});

app.use("/graphql", graphqlHTTP(async (req, res) => ({
	schema,
	graphiql: !!process.env.GRAPHIQL,
	pretty: true,
	context: await context(req),
})));

// Serving client
app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
	return res.sendFile(path.join(__dirname, '..', 'client', 'dist', "index.html"));
});

app.listen(PORT, () => {
	console.log('Listening on port', PORT);
});
