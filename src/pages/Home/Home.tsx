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
  
  const HomePageComponent: React.FunctionComponent = () => {
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
            Welcome
        </IonContent>
      </IonPage>
    );
  };
  
  export const HomePage = HomePageComponent;
  