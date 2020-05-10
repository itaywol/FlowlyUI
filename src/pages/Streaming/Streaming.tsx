import {
    IonButtons,
    IonContent,
    IonHeader,
    IonMenuButton,
    IonPage,
    IonTitle,
    IonToolbar,
    IonButton,
  } from "@ionic/react";

  import React from "react";
import { withStreamWebRTC, StreamProviderState } from "../../providers/StreamingProvider";

interface StreamingProps {
stream: StreamProviderState;
}

  const StreamingComponent: React.FunctionComponent<StreamingProps> = ({stream}) => {

    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>{"Home"}</IonTitle>
          </IonToolbar>
        </IonHeader>
  
        <IonContent>
            {stream.type === "Ready" ? <IonButton onClick={() => stream.startStreaming(33)}>Start Streaming</IonButton> : null}
        </IonContent>
      </IonPage>
    );
  };
  
  export const StreamingPage = withStreamWebRTC(StreamingComponent);
  