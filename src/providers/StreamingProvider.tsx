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

    startStreaming = async (_price: number) => {
        const client = socketIoClient("/stream", { path: "/ws" });
        const rtc = new RTCPeerConnection({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] });
        const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true});
        for (const track of stream.getTracks()) {
            console.log("added track:" + track);
            rtc.addTrack(track);
        }
        rtc.onicecandidate = (e) => { if (e.candidate !== null) client.emit("candidate", e.candidate) };
        rtc.onconnectionstatechange = () => { console.log(rtc.connectionState) };
        rtc.onnegotiationneeded = () => this.makeOffer(rtc, client);
        client.on("candidate", (data: RTCIceCandidate) => rtc.addIceCandidate(data))
        client.on("answer", async (data: RTCSessionDescriptionInit) => await rtc.setRemoteDescription(data));
        client.on("connect", () => this.makeOffer(rtc, client));
    }

    makeOffer = async (rtc: RTCPeerConnection, client: SocketIOClient.Socket) => {
        try {
            const offer = await rtc.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false });
            await rtc.setLocalDescription(offer);
            client.emit("offer", offer);
        } catch (e) {
            console.error("error creating offer");
        }
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
