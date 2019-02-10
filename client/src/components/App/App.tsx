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

interface GetUserData {
    user?: UserFields;
}

type ChildrenProps = (props: { loading: boolean, error?: ApolloError, data?: UserFields }) => JSX.Element;

interface AddUserProps {
    addUserMutation: MutationFn<AddUserData>;
    response: MutationResult<AddUserData>;
    userId: string;
    renderContent: ChildrenProps;
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
                                {({ loading, error, data }: {
                                    loading: boolean,
                                    error?: ApolloError,
                                    data?: GetUserData,
                                }) => {
                                    return this.renderContent({ loading, error, data: data ? data.user : undefined });
                                }}
                            </Query>
                        );
                }}
            </Mutation>
        );
    }

    private renderContent: ChildrenProps = ({
        loading,
        data = { projects: [], categories: [], tools: [], materials: []}
    }) => {
        return (
            <div className="app">
                <div className="title">Remembrall</div>
                <hr />
                <div className="grid">
                    {!loading && data && <>
                        <Column
                            type={ColumnType.Projects}
                            ticketData={data.projects}
                        />
                        <Column
                            type={ColumnType.Categories}
                            ticketData={data.categories}
                        />
                        <Column
                            type={ColumnType.Tools}
                            ticketData={data.tools}
                        />
                        <Column
                            type={ColumnType.Materials}
                            ticketData={data.materials}
                        />
                    </>}
                    {loading &&
                        <div className="loading">
                            {spinnerSvg}
                        </div>
                    }
                </div>
            </div>
        );
    }
}
