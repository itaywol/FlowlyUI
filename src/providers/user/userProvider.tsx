import React, { Component, useContext } from "react";
import { Optionalize } from "../../utils/Optionalize";
import { useQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { ExecutionResult } from "@apollo/react-common";

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
    logout: () => Promise<ExecutionResult<void>>;
    register: (email: string, password: string) => Promise<ExecutionResult<User | undefined>>;
    login: (email: string, password: string) => Promise<ExecutionResult<User | undefined>>;
    refresh: () => Promise<ExecutionResult<User | undefined>>;
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
  }

  componentDidMount() {
    this.refresh();
  }

  refresh() {
    const [invoke, result] = useMutation(gql`
      mutation get() {
        get() {
          message
        }
      }
    `);

    return invoke().then((data) => {
      // TODO: FIX INTERFACES
      this.setState({type: "Ready",
                     user: data.data as User,
                     logout: this.logout,
                     register: this.register,
                     login: this.login,
                     refresh: this.refresh
                    });
      return (data.data);
    });
  }

  logout() {
    const [invoke] = useMutation<void>(gql`
      mutation logout() {
        logout() {
          message
        }
      }
    `);

    return invoke();
  }

  register(email: string, password: string) {
    const [invoke] = useMutation(gql`
      mutation register($data: credentialsInput!) {
        register(data: $data) {
          message
        }
      }
    `);

    return invoke({variables: {data: {email, password}}});
  }

  login(email: string, password: string) {
    const [invoke] = useMutation<User | undefined>(gql`
      mutation login($data: credentialsInput!) {
        login(data: $data) {
          message
        }
      }
    `);

    return invoke({variables: {data: {email, password}}});
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
