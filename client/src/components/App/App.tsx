import * as React from "react";
import "./app.less";

import { Column } from "../Column/Column";
import { ColumnType } from "../../types";

export class App extends React.Component {
    public render() {
        return (
            <div className="app">
                <div className="title">Remembrall</div>
                <hr />
                <div className="grid">
                    <Column type={ColumnType.Projects} />
                    <Column type={ColumnType.Categories} />
                    <Column type={ColumnType.Tools} />
                    <Column type={ColumnType.Materials} />
                </div>
            </div>
        );
    }
}
