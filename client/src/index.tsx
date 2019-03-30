import * as React from "react";
import * as ReactDOM from "react-dom";
import { InMemoryCache, ApolloClient } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { App } from "./components/App/App";
import { getStorageKey, StorageKeys } from "./utils/localStorage";

import "./styles/common.less";

const httpLink = createHttpLink({ uri: "/graphql" });

const authLink = setContext((_, { headers }) => ({
    headers: {
        ...headers,
        authorization: getStorageKey(StorageKeys.UserId),
    }
}));

const client = new ApolloClient({
	link: authLink.concat(httpLink),
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
