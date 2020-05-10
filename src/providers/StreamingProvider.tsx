import React, { Component, useContext } from "react";
import { Optionalize } from "../utils/Optionalize";
import { CreateUserDTO } from "../interfaces/user";
import Axios, { AxiosResponse } from "axios";
import socketIoClient from "socket.io-client";

declare namespace StreamProviderState {
    interface UnInitialized {
        type: "UnInitialized"
    }

    interface Ready {
        type: "Ready";
        startStreaming: (price: number) => void;
    }

    interface Connecting {
        type: "Connecting";
    }

    interface Failed {
        type: "Failed";
        error: any;
    }
}

export type StreamProviderState =
    StreamProviderState.UnInitialized
    | StreamProviderState.Ready
    | StreamProviderState.Failed;

export const StreamingContext = React.createContext<StreamProviderState>({
    type: "UnInitialized"
});

export class StreamingProvider extends Component<{}, StreamProviderState> {
    constructor(props: {}) {
        super(props);

        this.state = { type: "Ready", startStreaming: this.startStreaming };
    }

    startStreaming = (_price: number): void => {
        const client = socketIoClient("/stream", { path: "/ws" });
        const rtc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        rtc.onicecandidate = (e) => this.onIceCandidate(e, client);
        rtc.onconnectionstatechange = () => console.log(rtc.connectionState);
        client.once("offer", (data:string) => this.onOfferReceived(rtc, client, data))
    }

    onOfferReceived = (_rtc: RTCPeerConnection, _client: SocketIOClient.Socket, data: string) => {
        console.log(data);
        debugger;
    }

    onIceCandidate(e: RTCPeerConnectionIceEvent, client: SocketIOClient.Socket) {
        client.emit("candidate", e.candidate);
    }
    
    render() {
        return (
            <StreamingContext.Provider value={this.state}>
                {this.props.children}
            </StreamingContext.Provider>
        );
    }
}

export interface WithUserProps {
    stream: StreamProviderState;
}

export function withStreamWebRTC<T extends WithUserProps = WithUserProps>(
    WrappedComponent: React.ComponentType<T>
) {
    return (props: Optionalize<T, WithUserProps>) => {
        const stream = useContext(StreamingContext);

        return <WrappedComponent {...(props as T)} stream={stream} />;
    };
}
