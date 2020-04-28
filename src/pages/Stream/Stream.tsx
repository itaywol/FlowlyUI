import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonButton,
} from "@ionic/react";
import React from "react";
import { withUser, WithUserProps } from "../../providers/UserProvider";
import { withRouter, RouterProps, Redirect } from "react-router";
import {
  withUserChannel,
  withChannelProps,
  ChannelProvider,
} from "../../providers/UserChannel";

export const StreamPageComponenet: React.FunctionComponent<
  RouterProps & WithUserProps & withChannelProps
> = ({ user, sendMessage }) => {
  if (user.type === "Loading") return <IonSpinner />;
  if (user.type === "Failed") return <Redirect to="/login" />;
  if (user.type === "Ready") {
    if (!user.user) return <Redirect to="/login" />;
    return (
      <IonPage>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="start">
              <IonMenuButton />
            </IonButtons>
            <IonTitle>Channel</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen class="ion-padding">
          <IonHeader>
            <IonToolbar slot="start"></IonToolbar>
          </IonHeader>
          <IonContent>
            <IonButton
              onClick={() => {
                if (sendMessage) sendMessage("hello");
              }}
            >
              Send message
            </IonButton>
          </IonContent>
        </IonContent>
      </IonPage>
    );
  }

  return <></>;
};

export const StreamPage = withRouter(
  withUser(withUserChannel(StreamPageComponenet))
);
