import React, { useState, useContext, useEffect } from "react";
import { Optionalize } from "../../utils/Optionalize";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { ExecutionResult } from "@apollo/react-common";

interface User {
  id: string;
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
    register: (
      email: string,
      password: string
    ) => Promise<ExecutionResult<User | undefined>>;
    login: (
      email: string,
      password: string
    ) => Promise<ExecutionResult<User | undefined>>;
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
  type: "Loading",
});

export const UserProvider: React.FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<UserProviderState>({ type: "Loading" });

  //TODO: for all of the custom hooks must define return type
  // REACT RULE: all hooks must be typed like useXXXXX
  const useRefresh: any = () => {
    const [invoke, result] = useLazyQuery(gql`
      query get {
        get {
          id: _id
          email
        }
      }
    `);
    useEffect(() => {
      invoke();
    }, []);

    useEffect(() => {
      if (result.data && result.called === true) {
        console.log("refresh");
        setUser({
          type: "Ready",
          user: result.data.get as User,
          logout: useLogout,
          register: useRegister,
          login: useLogin,
          refresh: useRefresh,
        });
      }
    }, [result.data, result.called]);

    return result.data;
  };
  useRefresh();

  const useLogout: any = () => {
    const [invoke, result] = useMutation<void>(gql`
      query logout {
        logout
      }
    `);

    invoke();
    return result.data;
  };

  const useRegister: any = (email: string, password: string) => {
    const [invoke, result] = useMutation(gql`
      mutation register($data: credentialsInput!) {
        register(data: $data)
      }
    `);
    invoke({ variables: { data: { email, password } } });
    return result.data;
  };

  const useLogin: any = (email: string, password: string) => {
    const [invoke, result] = useMutation<User | undefined>(gql`
      query login($data: credentialsInput!) {
        login(data: $data)
      }
    `);

    invoke({ variables: { data: { email, password } } });
    return result.data;
  };

  return <UserContext.Provider value={user}>{children}</UserContext.Provider>;
};

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
