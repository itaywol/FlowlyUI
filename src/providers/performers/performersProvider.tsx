import React, { useState, useContext, useEffect } from "react";
import { Optionalize } from "../../utils/Optionalize";
import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";
import { ExecutionResult } from "@apollo/react-common";

declare namespace PerformerProviderState {
  interface Loading {
    type: "Loading";
  }

  interface Ready {
    type: "Ready";
    Performers: string[] | undefined;
    refresh: () => Promise<ExecutionResult<string[] | undefined>>;
  }

  interface Failed {
    type: "Failed";
    error: any;
  }
}

export type PerformerProviderState =
  | PerformerProviderState.Loading
  | PerformerProviderState.Ready
  | PerformerProviderState.Failed;

export const PerformersContext = React.createContext<PerformerProviderState>({
  type: "Loading",
});

export const PerformerProvider: React.FunctionComponent = ({ children }) => {
  const [state, setUser] = useState<PerformerProviderState>({
    type: "Loading",
  });

  //TODO: for all of the custom hooks must define return type
  // REACT RULE: all hooks must be typed like useXXXXX
  const useRefresh: any = () => {
    const [invoke, result] = useLazyQuery(gql`
      query getActiveStreams {
        getActiveStreams
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
          Performers: result.data.getActiveStreams,
          refresh: useRefresh,
        });
      }
    }, [result.data, result.called]);

    return result.data;
  };
  useRefresh();
  return (
    <PerformersContext.Provider value={state}>
      {children}
    </PerformersContext.Provider>
  );
};

export interface WithPerformersProps {
  performers: PerformerProviderState;
}

export function withPerformers<
  T extends WithPerformersProps = WithPerformersProps
>(WrappedComponent: React.ComponentType<T>) {
  return (props: Optionalize<T, WithPerformersProps>) => {
    const performers = useContext(PerformersContext);

    return <WrappedComponent {...(props as T)} performers={performers} />;
  };
}
