import React, { Component, useContext } from "react";
import { Optionalize } from "../utils/Optionalize";
import { CreateUserDTO } from "../interfaces/user";
import Axios, { AxiosResponse } from "axios";

interface User {
  userName: string;
  firstName: string;
  lastName: string;
}

declare namespace UserProviderState {
  interface Loading {
    type: "Loading";
  }

  interface Ready {
    type: "Ready";
    user: User | undefined;
    logout: () => Promise<AxiosResponse<void>>;
    register: (data: CreateUserDTO) => Promise<AxiosResponse<User | undefined>>;
    login: (
      email: string,
      password: string
    ) => Promise<AxiosResponse<User | undefined>>;
    refresh: () => Promise<AxiosResponse<User | undefined>>;
  }

  interface Failed {
    type: "Failed";
    error: any;
  }
}

export type UserProviderState =
  | UserProviderState.Loading
  | UserProviderState.Ready
  | UserProviderState.Failed;

export const UserContext = React.createContext<UserProviderState>({
  type: "Loading"
});

export class UserProvider extends Component<{}, UserProviderState> {
  constructor(props: {}) {
    super(props);

    this.state = { type: "Loading" };
    this.refresh();
  }

  refresh = () => {
    this.setState({type: "Loading"});
    return Axios.get<User>("/api/auth").then(data => {
      debugger;
      this.setState({
        type: "Ready",
        login: this.login,
        logout: this.logout,
        refresh: this.refresh,
        register: this.register,
        user: data.data
      });

      return data;
    });
  }

  logout = () => {
    this.setState({type: "Loading"});
    return Axios.delete<void>("/api/auth").then(data => {
      this.setState({
        type: "Ready",
        login: this.login,
        logout: this.logout,
        refresh: this.refresh,
        register: this.register,
        user: undefined
      });
      return data;
    });
  }

  register = (data: CreateUserDTO) => {
    this.setState({type: "Loading"});
    return Axios.post<User | undefined>("/api/user", data).then(data => {
      this.setState({
        type: "Ready",
        login: this.login,
        logout: this.logout,
        refresh: this.refresh,
        register: this.register,
        user: data.data
      });

      return data;
    });
  }

  login = () => {
    this.setState({type: "Loading"});
    return Axios.post<User>("/api/auth").then(data => {
      this.setState({
        type: "Ready",
        login: this.login,
        logout: this.logout,
        refresh: this.refresh,
        register: this.register,
        user: data.data
      });

      return data;
    });
  }

  render() {
    return (
      <UserContext.Provider value={this.state}>
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export interface WithUserProps {
  user: UserProviderState;
}

export function withUser<T extends WithUserProps = WithUserProps>(
  WrappedComponent: React.ComponentType<T>
) {
  return (props: Optionalize<T, WithUserProps>) => {
    const user = useContext(UserContext);

    return <WrappedComponent {...(props as T)} user={user} />;
  };
}
