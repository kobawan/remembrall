import * as React from "react";
import "./app.less";

import { Cube } from "../Cube/Cube";

export class App extends React.Component {
    public render() {
        return (
            <div className="app">
                <div className="title">Remembrall</div>
                <hr />
                <Cube />
            </div>
        );
    }
}
