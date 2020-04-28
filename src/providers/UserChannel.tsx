import React, {
  FC,
  Reducer,
  createContext,
  useContext,
  useEffect,
} from "react";
import socketIoClient from "socket.io-client";
import { User } from "./UserProvider";
import { useImmerReducer } from "use-immer";
import { Draft } from "immer";
import { Optionalize } from "../utils/Optionalize";
import Axios, { AxiosResponse } from "axios";

export interface ChatEntry {
  sender: string;
  message: string;
}

export interface Channel {
  user: User;
  chatHistory: ChatEntry[];
}

export interface ChannelStateProvider {
  channel?: Channel;
  sendMessage?: (message: string) => void;
}

export type ChannelReducerActions =
  | { type: "setChannelData"; data: Channel }
  | { type: "addMessage"; message: ChatEntry };

export const ChannelStateReducer: Reducer<
  ChannelStateProvider,
  ChannelReducerActions
> = (
  draft: Draft<ChannelStateProvider>,
  action: ChannelReducerActions
): ChannelStateProvider => {
  switch (action.type) {
    case "setChannelData": {
      draft.channel = action.data;
      break;
    }
    case "addMessage": {
      draft.channel?.chatHistory.push(action.message);
    }
  }
  return draft;
};

export const ChannelContext = createContext<ChannelStateProvider>({});

export const ChannelProvider: FC = ({ children }) => {
  const [state, dispatch] = useImmerReducer(ChannelStateReducer, {});
  const socket = socketIoClient("/chat", { path: "/ws" });

  const pathSplit: string[] = window.location.pathname.split("/");
  const channelNickName = pathSplit[pathSplit.length - 1];

  useEffect(() => {
    Axios.get("/api/user", { params: { nickName: channelNickName } }).then(
      (response: AxiosResponse<User>) => {
        dispatch({
          type: "setChannelData",
          data: { user: response.data, chatHistory: [] },
        });
      }
    );
    socket.on(
      "onMessageFromServer",
      (data: { sender: string; message: string }) => {
        dispatch({ type: "addMessage", message: data });
      }
    );
  }, []);

  useEffect(() => {
    if (state?.channel?.user.nickName !== undefined) {
      socket.emit("joinRoom", { room: state.channel?.user.nickName });
    }
  }, [state, socket]);

  const sendMessage = (message: string) => {
    console.log(message);
    socket.emit("onMessageFromClient", {
      room: state?.channel?.user.nickName,
      message: message,
    });
  };

  return (
    <ChannelContext.Provider value={{ channel: state.channel, sendMessage }}>
      {children}
    </ChannelContext.Provider>
  );
};

export interface withChannelProps extends ChannelStateProvider {
  channel: Channel;
  sendMessage: (message: string) => void;
}

export function withUserChannel<T extends withChannelProps = withChannelProps>(
  WrappedComponent: React.ComponentType<T>
) {
  return (props: Optionalize<T, withChannelProps>) => {
    const channel = useContext(ChannelContext);

    return <WrappedComponent {...(props as T)} channel={channel} />;
  };
}
