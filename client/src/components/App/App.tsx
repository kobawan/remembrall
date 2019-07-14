import * as React from "react";
import "./app.less";

import { ColumnsManager } from "../ColumnsManager/ColumnsManager";
import { Login } from "../Login/Login";
import { getStorageKey, StorageKeys } from "../../utils/localStorage";

interface AppState {
	userHasLoggedIn: boolean;
}

export class App extends React.PureComponent<{}, AppState> {
	public state: AppState = {
		userHasLoggedIn: !!getStorageKey(StorageKeys.UserId),
	};

	public render() {
		return (
			<div className="app">
				<div className="title">Remembrall</div>
				<hr />
				{this.state.userHasLoggedIn
					? <ColumnsManager />
					: <Login updateLoginState={this.toggleUserLogin}/>
				}
			</div>
		);
	}

	private toggleUserLogin = () => {
		this.setState({ userHasLoggedIn: !this.state.userHasLoggedIn});
	}
}
