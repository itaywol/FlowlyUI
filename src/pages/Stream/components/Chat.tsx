import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import React from "react";
import { withUser } from "../../../providers/UserProvider";

export const ChatCompoenent: React.FunctionComponent = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Chat</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen class="ion-padding"></IonContent>
    </IonPage>
  );
};

export const Chat = withUser(ChatCompoenent);
