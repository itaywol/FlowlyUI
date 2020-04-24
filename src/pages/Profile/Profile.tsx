import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButton,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import React from "react";
import "./Profile.scss";
import { UserProviderState, withUser } from "../../providers/UserProvider";
import assertNever from "assert-never";

interface ProfileProps {
  user: UserProviderState;
}

const ProfilePageContent: React.FunctionComponent<ProfileProps> = (
  props: ProfileProps
) => {
  if (props.user.type === "Loading" || props.user.type === "Failed")
    return <></>;
  return (
    props.user.user && (
      <IonCard>
        <IonCardHeader>
          <IonCardTitle>Hello {props.user.user?.nickName}</IonCardTitle>
          <IonCardSubtitle>
            eBalance: {props.user.user?.balance.currentBalance}
          </IonCardSubtitle>
        </IonCardHeader>
        <IonCardContent>
          <IonButton href="/payment">Payment</IonButton>
        </IonCardContent>
      </IonCard>
    )
  );
};

const ProfilePageComponent: React.FunctionComponent<ProfileProps> = (
  props: ProfileProps
) => {
  switch (props.user.type) {
    case "Loading":
      return (
        <IonPage>
          <IonSpinner />
        </IonPage>
      );
    case "Ready":
      return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>My Profile</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent fullscreen class="ion-padding">
            <ProfilePageContent {...props} />
          </IonContent>
        </IonPage>
      );
    case "Failed":
      return <div>Error getting user</div>;
    default:
      assertNever(props.user);
  }
};

export const ProfilePage = withUser(ProfilePageComponent);
