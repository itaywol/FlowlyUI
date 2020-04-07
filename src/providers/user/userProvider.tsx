import React, { Component, useContext } from "react";
import { Optionalize } from "../../utils/Optionalize";
import { useQuery } from "@apollo/react-hooks";

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
    value: User | undefined;
    logout: () => void;
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
  }

  componentDidMount() {
    this.refreshUser();
  }

  refreshUser() {
    // this.props
    // .getUser()
    // .then((response) => this.setState({ type: 'Ready', value: response }))
    // .catch((error) => this.setState({ type: 'Failed', error: error }));
  }

  getChildContext() {
    return { covid: this.state };
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

export function withCovid<T extends WithUserProps = WithUserProps>(
  WrappedComponent: React.ComponentType<T>
) {
  return (props: Optionalize<T, WithUserProps>) => {
    const user = useContext(UserContext);

    return <WrappedComponent {...(props as T)} user={user} />;
  };
}
