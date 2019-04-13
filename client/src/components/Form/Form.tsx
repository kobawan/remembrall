import * as React from "react";
import "./form.less";

interface FormProps {
	categoriesDB: string[];
	materialsDB: string[];
}

type InputNames = "projectName" | "categories" | "tools" | "materials" | "notes" | "instructions";
type FormState = { [key in InputNames]: string } & { toolsDB: string[] };

export class Form extends React.Component<FormProps, FormState> {
	public state: FormState = {
		projectName: "",
		categories: "",
		tools: "",
		materials: "",
		notes: "",
		instructions: "",
		toolsDB: [],
	};

	public render() {
		const { categoriesDB, materialsDB } = this.props;
		const { projectName, categories, tools, materials, notes, instructions, toolsDB } = this.state;
		return (
			<div className="form">
				<input
					type="text"
					name="projectName"
					onChange={this.handleInput}
					placeholder="Project name"
					value={projectName}
				/>
				<div className="content">
					{this.renderTextInput("categories", categories, categoriesDB)}
					{this.renderTextInput("tools", tools, toolsDB)}
					{this.renderTextInput("materials", materials, materialsDB)}
					{this.renderTextareaInput("notes", notes)}
					{this.renderTextInput("instructions", instructions)}

				</div>
				<button onClick={this.submitProject}>Save</button>
			</div>
		);
	}

	private handleInput = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
		const name = e.target.name as InputNames;
		const val = e.target.value;

		// TODO: if option was added, send it to db
		const wasAddedOption = val.includes("+ Add ");

		let toolsDB: string[] = [];
		if (name === "categories") {
			const wasSelectedOption = this.props.categoriesDB.find(option => val === option);
			if (wasAddedOption || wasSelectedOption) {
				// TODO fetch right tools based on category
				toolsDB = ["2mm", "4mm"];
			}
		}

		const state = {
			[name]: !wasAddedOption ? val : val.slice(6),
			toolsDB,
		} as FormState;
		this.setState(state);
	}

	private renderOptions = (arr: string[]) => {
		return arr.map((val, key) =>
			<option value={val} key={key}/>
		);
	}

	private renderTextInput = (name: string, value: string, options?: string[]) => {
		return (
			<div className="row">
				<label>{name}</label>
				<input
					type="text"
					name={name}
					list={options ? name : undefined}
					onChange={this.handleInput}
					value={value}
					className={options ? "" : "withoutDropdown"}
				/>
				{options && (
					<datalist id={name}>
						{value && (
							<option>+ Add {value}</option>
						)}
						{this.renderOptions(options)}
					</datalist>
				)}
			</div>
		);
	}

	private renderTextareaInput = (name: string, value: string) => {
		return (
			<div className="row">
				<label>{name}</label>
				<textarea
					name={name}
					onChange={this.handleInput}
					value={value}
				/>
			</div>
		);
	}

	private submitProject = () => {
		// Send data to graphql
	}
}