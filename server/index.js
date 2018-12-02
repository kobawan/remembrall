const express = require('express');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const graphqlHTTP = require("express-graphql");

const app = express();
const PORT = process.env.PORT || 4000;

mongoose.connect(
    "mongodb://kobawan:fpfSywHN8pnQpT7@ds137661.mlab.com:37661/remembrall",
    { useNewUrlParser: true },
)
mongoose.connection.once("open", () => {
    console.log("Connected to Database...")
});

app.use(cors());

app.use("/graphql", graphqlHTTP({
    schema,
    graphiql: true, //TODO: enable according to environment process.env.GRAPHIQL
}));

app.use(express.static(path.join(__dirname, '..', 'client', 'dist')));

app.get('*', (req, res) => {
    return res.sendFile(path.join(__dirname, '..', 'client', 'dist', "index.html"));
});

app.listen(PORT, () => {
    console.log('Listening on port ', PORT);
});
