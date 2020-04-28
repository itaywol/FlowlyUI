import React, { Component, useContext } from "react";
import { Optionalize } from "../utils/Optionalize";
import { CreateUserDTO } from "../interfaces/user";
import Axios, { AxiosResponse } from "axios";

interface Balance {
  currentBalance: number;
}

export interface User {
  email: string;
  nickName: string;
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  balance: Balance;
}

declare namespace UserProviderState {
  interface Loading {
    type: "Loading";
  }

  interface Ready {
    type: "Ready";
    user: User | null;
    logout: () => Promise<AxiosResponse<void>>;
    register: (data: CreateUserDTO) => Promise<AxiosResponse<User>>;
    login: (email: string, password: string) => Promise<User | null>;
    refresh: () => Promise<User | null>;
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
  type: "Loading",
});

export class UserProvider extends Component<{}, UserProviderState> {
  constructor(props: {}) {
    super(props);

    this.state = { type: "Loading" };
    this.refresh();
  }

  refresh = async (): Promise<User | null> => {
    this.setState({ type: "Loading" });

    let result = null;

    try {
      const data = (await Axios.get<User | null>("/api/auth")).data;

      this.setState({
        type: "Ready",
        ...this.getFunctions(),
        user: data,
      });

      result = data;
    } catch (e) {
      switch (e.response.status) {
        case 401:
          this.setState({
            type: "Ready",
            ...this.getFunctions(),
            user: null,
          });
          break;
        default:
          this.setState({ type: "Failed" });
          throw e;
      }
    }

    return result;
  };

  logout = () => {
    this.setState({ type: "Loading" });
    return Axios.delete<void>("/api/auth").then((data) => {
      this.setState({
        type: "Ready",
        ...this.getFunctions(),
        user: undefined,
      });
      return data;
    });
  };

  register = (data: CreateUserDTO) => {
    this.setState({ type: "Loading" });
    return Axios.post<User>("/api/user", data).then((data) => {
      this.setState({
        type: "Ready",
        ...this.getFunctions(),
        user: data.data,
      });

      return data;
    });
  };

  login = async (email: string, password: string) => {
    this.setState({ type: "Loading" });

    let result = null;

    try {
      const data = (await Axios.post<User>("/api/auth", { email, password }))
        .data;

      this.setState({
        type: "Ready",
        ...this.getFunctions(),
        user: data,
      });

      result = data;
    } catch (e) {
      switch (e.response.status) {
        case 401:
          this.setState({
            type: "Ready",
            ...this.getFunctions(),
            user: null,
          });
          break;
        default:
          this.setState({ type: "Failed" });
          throw e;
      }
    }

    return result;
  };

  getFunctions() {
    return {
      login: this.login,
      logout: this.logout,
      refresh: this.refresh,
      register: this.register,
    };
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
