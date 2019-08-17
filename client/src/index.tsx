import React from "react";
import * as ReactDOM from "react-dom";
import { ApolloProvider } from "react-apollo";
import { App } from "./components/App/App";
import { client } from "./graphql/client";
import "./styles/common.less";

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
