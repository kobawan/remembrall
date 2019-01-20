import * as React from "react";
import * as ReactDOM from "react-dom";
import { ApolloClient, HttpLink, InMemoryCache } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { App } from "./components/App/App";

import "./styles/common.less";

const client = new ApolloClient({
	link: new HttpLink({ uri: "http://localhost:4000/graphql" }), // TODO Fix for prod
	cache: new InMemoryCache(),
});

export class Wrapper extends React.Component {
    public render() {
        return (
            <ApolloProvider client={client}>
                <App />
            </ApolloProvider>
        );
    }
}

ReactDOM.render(<Wrapper />, document.getElementById("root"));
