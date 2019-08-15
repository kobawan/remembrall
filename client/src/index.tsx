import React from "react";
import * as ReactDOM from "react-dom";
import { InMemoryCache, ApolloClient, ApolloLink } from "apollo-boost";
import { ApolloProvider } from "react-apollo";
import { createHttpLink } from "apollo-link-http";
import { setContext } from "apollo-link-context";
import { App } from "./components/App/App";
import { getStorageKey, StorageKeys } from "./utils/localStorage";

import "./styles/common.less";

const link = ApolloLink.from([
  setContext((_, { headers }) => ({
    headers: {
      ...headers,
      authorization: getStorageKey(StorageKeys.UserId),
    }
  })),
  createHttpLink({ uri: "/graphql" }),
]);

const client = new ApolloClient({
  link,
  cache: new InMemoryCache(),
});

// tslint:disable:no-console
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker.register("/sw.js")
    .then(() => console.log("Service Worker Registered"))
    .catch((e) => console.log("Service worker error", e));
  });
}
// tslint:enable:no-console

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
