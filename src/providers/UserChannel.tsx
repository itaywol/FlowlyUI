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

export interface ChatMessage {
  sender: { user: string; nickName: String };
  message: string;
  createdAt: number;
  _id: string;
}

export interface ChatSettings {
  censorOffensiveWords: boolean;
}

export interface ChannelChat {
  chatMessages: ChatMessage[];
  chatSettings: ChatSettings;
  connected: boolean;
}

export interface Channel {
  owner: User;
  chat: ChannelChat;
}

export interface UserChannel {
  state: "Init" | "Loading" | "Ready" | "Failed";
  channel: Channel | undefined;
  getChannelData: (() => void) | null;
  sendMessage: ((message: string, room: string) => void) | null;
  joinChatRoom: (() => void) | null;
  leaveChatRoom: (() => void) | null;
}

export type UserChannelActionsReducer =
  | {
      type: "setChannelData";
      data: Channel;
    }
  | { type: "addMessageToChat"; message: ChatMessage }
  | {
      type: "joinedChannelChat";
      success: boolean;
    }
  | {
      type: "assignMethods";
      getChannelData: () => void;
      sendMessage: (message: string, room: string) => void;
      joinChatRoom: () => void;
      leaveChatRoom: () => void;
    };

export const UserChannelStateReducer: Reducer<
  UserChannel,
  UserChannelActionsReducer
> = (
  draft: Draft<UserChannel>,
  action: UserChannelActionsReducer
): UserChannel => {
  switch (draft.state) {
    case "Init": {
      switch (action.type) {
        case "assignMethods": {
          draft.sendMessage = action.sendMessage;
          draft.joinChatRoom = action.joinChatRoom;
          draft.getChannelData = action.getChannelData;
          draft.leaveChatRoom = action.leaveChatRoom;
          draft.state = "Loading";
        }
      }
      break;
    }
    case "Loading": {
      switch (action.type) {
        case "setChannelData": {
          draft.state = "Ready";
          draft.channel = action.data;
        }
      }
      break;
    }
    case "Ready": {
      switch (action.type) {
        case "joinedChannelChat": {
          if (draft.channel) {
            draft.channel.chat.connected = action.success;
          }
          break;
        }
        case "addMessageToChat": {
          if (draft.channel && draft.channel?.chat?.chatMessages) {
            draft.channel.chat.chatMessages.push(action.message);
            break;
          }
          if (
            draft.channel &&
            !Array.isArray(draft.channel?.chat?.chatMessages)
          ) {
            draft.channel.chat.chatMessages = [action.message];
            break;
          }
        }
      }
      break;
    }
    case "Failed": {
      break;
    }
    default: {
    }
  }
  return draft;
};

export const UserChannelInitialState: UserChannel = {
  state: "Init",
  channel: undefined,
  getChannelData: null,
  sendMessage: null,
  joinChatRoom: null,
  leaveChatRoom: null,
};

export const UserChannelContext = createContext<UserChannel>(
  UserChannelInitialState
);

export const UserChannelProvider: FC = ({ children }) => {
  const [state, dispatch] = useImmerReducer(
    UserChannelStateReducer,
    UserChannelInitialState
  );
  const socket = socketIoClient("/chat", { path: "/ws" });
  socket.on("onMessageFromServer", (data: ChatMessage) => {
    dispatch({ type: "addMessageToChat", message: data });
  });

  const pathSplit: string[] = window.location.pathname.split("/");
  const channelNickName = pathSplit[pathSplit.length - 1];

  const getChannelData = () => {
    if (state.state === "Loading" && channelNickName)
      Axios.get("/api/user/channel", {
        params: { nickName: channelNickName },
      }).then((response: AxiosResponse<Channel>) => {
        dispatch({ type: "setChannelData", data: response.data as Channel });
      });
  };

  const joinChatRoom = () => {
    if (
      state.state === "Ready" &&
      !state.channel?.chat?.connected &&
      state?.channel?.owner?.nickName
    ) {
      socket.emit("joinRoom", { room: state.channel?.owner?.nickName });
      socket.on("joinedRoom", (data: ChannelChat) => {
        if (data)
          dispatch({
            type: "joinedChannelChat",
            success: true,
          });
      });
    }
  };

  const sendMessage = (message: string, room: string) => {
    socket.emit("onMessageFromClient", {
      room: room,
      message: message,
    });
  };
  useEffect(() => {
    if (state.state === "Init") {
      dispatch({
        type: "assignMethods",
        sendMessage,
        joinChatRoom,
        getChannelData,
        leaveChatRoom: () => {},
      });
    }
    if (state.state === "Loading") {
      getChannelData();
    }

    if (state.state === "Ready") {
      joinChatRoom();
    }
  }, [state]);

  return (
    <UserChannelContext.Provider value={state}>
      {children}
    </UserChannelContext.Provider>
  );
};

export interface withUserChannelProps {
  channel: UserChannel;
}

export function withUserChannel<
  T extends withUserChannelProps = withUserChannelProps
>(WrappedComponent: React.ComponentType<T>) {
  return (props: Optionalize<T, withUserChannelProps>) => {
    const channel = useContext(UserChannelContext);

    return <WrappedComponent {...(props as T)} channel={channel} />;
  };
}
