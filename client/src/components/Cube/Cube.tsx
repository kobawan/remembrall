import * as React from "react";
import "./cube.less";
import { Form } from "../Form/Form";

interface CubeState {
    selected: boolean;
}

export class Cube extends React.Component<{}, CubeState> {
    public state: CubeState = {
        selected: false,
    };

    public render() {
        const selected = this.state.selected;
        const plusSvg = (
            <svg className="icon plus" viewBox="0 0 5 5" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 1 h1 v1 h1 v1 h-1 v1 h-1 v-1 h-1 v-1 h1 z" />
            </svg>
        );
        return (
            <div className={`cube ${selected ? "selected" : ""}`} onClick={this.handleClick}>
                {!selected
                    ? plusSvg
                    : <Form
                        categoriesDB={["Knitting", "Crocheting"]}
                        materialsDB={["100% wool pink", "100% alpaca white"]}
                    />
                }
            </div>
        );
    }

    private handleClick = () => {
        this.setState({ selected: true });
    }
}
