import * as React from "react";
import { Query } from "react-apollo";
import { ApolloError } from "apollo-boost";
import "./app.less";

import { getStorageKey, StorageKeys, setStorageKey } from "../../utils/localStorage";
import { GET_USER } from "../../queries/queries";
import { spinnerSvg } from "../Svg/Svg";
// import { ProjectColumn } from "../Column/ProjectColumn";
import { CommonFields } from "../../types";

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

export class App extends React.Component {
	private userIdHasBeenUpdated = false;

    public render() {
        return (
            <Query query={GET_USER}>
                {({ loading, error, data }: { loading: boolean, error?: ApolloError, data?: GetUserData }) => {
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
                                        {/* <ProjectColumn
                                            tickets={data.user.projects}
                                        /> */}
                                    </> : (
                                        <div className="loading">
                                            {spinnerSvg}
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
