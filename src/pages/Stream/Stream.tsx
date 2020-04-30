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
import React, { FC } from "react";
import { withUser, WithUserProps } from "../../providers/UserProvider";
import { withRouter, RouterProps, Redirect } from "react-router";
import {
  withUserChannel,
  UserChannelProvider,
  withUserChannelProps,
} from "../../providers/UserChannel";
import { Chat } from "./components/Chat";

export const StreamPageComponenet: React.FunctionComponent<
  RouterProps & WithUserProps & withUserChannelProps
> = ({ user, channel }) => {
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
            <IonTitle>{channel.channel?.owner.nickName} Channel</IonTitle>
          </IonToolbar>
        </IonHeader>

        <IonContent fullscreen class="ion-padding">
          <IonHeader>
            <IonToolbar slot="start"></IonToolbar>
          </IonHeader>
          <IonContent>
            <Chat />
          </IonContent>
        </IonContent>
      </IonPage>
    );
  }
  return <></>;
};

export const WrappedStreamPage = withRouter(
  withUser(withUserChannel(StreamPageComponenet))
);

export const StreamPage: FC = () => {
  return (
    <UserChannelProvider>
      <WrappedStreamPage />
    </UserChannelProvider>
  );
};
