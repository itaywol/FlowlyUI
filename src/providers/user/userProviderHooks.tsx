import React, {
  createContext,
  useEffect,
  useContext,
  FunctionComponent,
} from "react";
import { useMutation } from "@apollo/react-hooks";
import gql from "graphql-tag";

// Define the schema TODO: move the desgnated schemas folder
export const REGISTER_USER = gql`
  mutation registerUser($data: userInput!) {
    registerUser(data: $data) {
      message
    }
  }
`;

// Create the Context TODO:define type
export const UserContext = createContext<any>(null);

// Creates a FunctionalComponent Context Provider passing its children through the context
export const UserMethodsProvider: FunctionComponent<any> = ({ children }) => {
  const registerUser = useMutation(REGISTER_USER);
  return (
    <UserContext.Provider value={{ registerUser }}>
      {children}
    </UserContext.Provider>
  );
};

// Create a Functional Hook (Returns value instead of TSX) that returns the usage of the context
export const useUserMethods: FunctionComponent<any> = () =>
  useContext(UserContext);
