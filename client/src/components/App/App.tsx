import * as React from "react";
import { Query, Mutation, MutationResult, MutationFn } from "react-apollo";
import { ApolloError } from "apollo-boost";
import "./app.less";

import { Column } from "../Column/Column";
import { ColumnType, UserFields } from "../../types";
import { getStorageKey, StorageKeys, setStorageKey } from "../../utils/localStorage";
import { ADD_USER, GET_USER } from "../../queries/queries";
import { spinnerSvg } from "../Svg/Svg";

interface AddUserData {
    addUser: UserFields;
}

interface AddUserProps {
    addUserMutation: MutationFn<AddUserData>;
    response: MutationResult<AddUserData>;
    userId: string;
    renderContent: (props: { loading: boolean, error?: ApolloError, data?: UserFields }) => JSX.Element;
}

class AddUser extends React.Component<AddUserProps> {
    public componentDidMount() {
        this.props.addUserMutation();
    }
    public render() {
        const { loading, error, data } = this.props.response;
        return this.props.renderContent({ loading, error, data: data ? data.addUser : undefined });
    }
}

export class App extends React.Component {
    private userId = getStorageKey(StorageKeys.UserId);

    public render() {
        return (
            <Mutation
                mutation={ADD_USER}
                onCompleted={({ addUser: { id } }: AddUserData) => {
                    setStorageKey(StorageKeys.UserId, id);
                }}
            >
                {(addUser, res) => {
                    return !this.userId
                        ? (
                            <AddUser
                                addUserMutation={addUser}
                                response={res}
                                userId={this.userId}
                                renderContent={this.renderContent}
                            />
                        ) : (
                            <Query query={GET_USER} variables={{ id: this.userId }}>
                                {this.renderContent}
                            </Query>
                        );
                }}
            </Mutation>
        );
    }

    private renderContent = (
        { loading, error, data }: { loading: boolean, error?: ApolloError, data?: UserFields }
    ) => (
        <div className="app">
            <div className="title">Remembrall</div>
            <hr />
            <div className="grid">
                {/* <Column
                    type={ColumnType.Projects}
                    ticketData={data && data.user && data.user.projects || []}
                    isLoading={isLoading}
                />
                <Column
                    type={ColumnType.Categories}
                    ticketData={data && data.user && data.user.categories || []}
                    isLoading={isLoading}
                />
                <Column
                    type={ColumnType.Tools}
                    ticketData={data && data.user && data.user.tools || []}
                    isLoading={isLoading}
                />
                <Column
                    type={ColumnType.Materials}
                    ticketData={data && data.user && data.user.materials || []}
                    isLoading={isLoading}
                /> */}
                {loading &&
                    <div className="loading">
                        {spinnerSvg}
                    </div>
                }
            </div>
        </div>
    )
}
