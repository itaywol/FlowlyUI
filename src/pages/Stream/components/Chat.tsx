import React from "react";
import {
  withUserChannel,
  withUserChannelProps,
  ChatMessage,
} from "../../../providers/UserChannel";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonLabel,
  IonItem,
  IonContent,
  IonHeader,
  IonTitle,
} from "@ionic/react";

export const ChatCompoenent: React.FunctionComponent<withUserChannelProps> = ({
  channel,
}) => {
  return (
    <IonContent>
      <IonHeader>
        <IonTitle>{channel.channel?.owner.nickName} Chat</IonTitle>
      </IonHeader>
      <IonContent style={{ height: "500px" }}>
        {channel?.channel?.chat.chatMessages.map((chatEntry: ChatMessage) => {
          return (
            <IonItem>
              {chatEntry.sender.nickName} - {chatEntry.message}
            </IonItem>
          );
        })}
      </IonContent>
      <IonContent>
        <IonButton
          onClick={() => {
            if (
              channel.sendMessage &&
              channel.state === "Ready" &&
              channel.channel?.owner.nickName
            )
              channel?.sendMessage("hey", channel?.channel?.owner?.nickName);
          }}
        >
          Send Message
        </IonButton>
      </IonContent>
    </IonContent>
  );
};

export const Chat = withUserChannel(ChatCompoenent);
