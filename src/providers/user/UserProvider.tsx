import React, {
  PropsWithChildren,
  useState,
  FC,
  createContext,
  useEffect,
  useContext,
} from "react";
import useFetch from "../../hooks/useFetch";
import { AxiosResponse, AxiosError } from "axios";

export interface User {
  _id: string;
}

export interface IUserContext {
  user: User | undefined | AxiosResponse<User> | AxiosError<User>;
  refresh: () => void;
}

export const UserContext = createContext<IUserContext>({
  user: undefined,
  refresh: () => {},
});

export const UserProvider: FC<PropsWithChildren<any>> = ({ children }) => {
  const [user, setUser] = useState<
    AxiosResponse<User> | AxiosError<User> | undefined
  >();
  const [userFetch, { response, loading, error, called }] = useFetch<User>();
  useEffect(() => {
    if (!user && !error && !response && !called)
      userFetch({ url: "/api/user", method: "get" });

    if (!user && called && !response?.request && !error) setUser(response);
  }, [response, loading, error, user, called]);

  return (
    <UserContext.Provider
      value={{
        user,
        refresh: () => userFetch({ url: "/api/user", method: "get" }),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext<IUserContext>(UserContext);
