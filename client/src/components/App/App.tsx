import * as React from "react";
import { Query, QueryResult } from "react-apollo";
import "./app.less";

import { getStorageKey, StorageKeys, setStorageKey } from "../../utils/localStorage";
import { GET_USER } from "../../queries/queries";
import { ProjectColumn } from "../Column/ProjectColumn";
import { CommonFields } from "../../types";
import { Loading } from "../Loading/Loading";

interface UserQueryRes {
	id: string;
	projects: CommonFields[];
	categories: CommonFields[];
	tools: CommonFields[];
	materials: CommonFields[];
}

interface GetUserData {
	user?: UserQueryRes;
}

export class App extends React.PureComponent {
	private userIdHasBeenUpdated = false;

	public render() {
		return (
			/**
			 * @todo GET_USER should only return user ID
			 */
			<Query query={GET_USER}>
				{({ loading, error, data }: QueryResult<GetUserData>) => {
					this.updateUserIdStorage(data);

					if(error) {
						console.error(error);
					}
					return (
						<div className="app">
							<div className="title">Remembrall</div>
							<hr />
							<div className="grid">
								{!loading && data && data.user
									? <>
										<ProjectColumn />
									</> : (
										<div className="loadingContainer">
											<Loading />
										</div>
									)
								}
							</div>
						</div>
					);
				}}
			</Query>
		);
	}

	/**
	 * Gets user id from server and sets it to local storage
	 */
	private updateUserIdStorage = (data?: GetUserData) => {
		if (this.userIdHasBeenUpdated || !data || !data.user) {
			return;
		}

		const userId = getStorageKey(StorageKeys.UserId);
		if (userId !== data.user.id) {
			setStorageKey(StorageKeys.UserId, data.user.id);
		}
		this.userIdHasBeenUpdated = true;
	}
}
