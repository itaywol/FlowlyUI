import {
  IonAvatar,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonImg,
  IonPage,
  IonToolbar,
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonRouterOutlet,
} from "@ionic/react";
import {
  chatboxOutline,
  desktopOutline,
  notificationsOutline,
  searchOutline,
} from "ionicons/icons";
import React from "react";
import { RouteComponentProps, Route } from "react-router";
import ExploreContainer from "../components/ExploreContainer";
import "./Page.css";
import Tabs from "../tabs/tabs";

const Page: React.FC<RouteComponentProps<{
  name: string;
  id: string;
}>> = ({ match }) => {
  return (
    <IonPage>
      <IonHeader collapse="condense" translucent>
        <IonToolbar className="top-toolbar">
          <IonAvatar
            slot="start"
            class="ion-margin-start border-radius top-toolbar-avatar"
          >
            <IonImg
              class="ion-margin-start"
              src={`https://api.adorable.io/avatars/81/${
                Math.random() * 1000
              }.png`}
              alt=""
              className="top-toolbar-avatar"
            />
          </IonAvatar>
          <IonButtons slot="end" collapse class="ion-margin-end ">
            <IonIcon
              className="top-toolbar-icons"
              slot="end"
              icon={desktopOutline}
              size="default"
              lazy
            ></IonIcon>
            <IonIcon
              className="top-toolbar-icons"
              slot="end"
              icon={notificationsOutline}
              size="default"
              lazy
            ></IonIcon>
            <IonIcon
              className="top-toolbar-icons"
              slot="end"
              icon={chatboxOutline}
              size="default"
              lazy
            ></IonIcon>
            <IonIcon
              className="top-toolbar-icons"
              slot="end"
              icon={searchOutline}
              size="default"
              lazy
            ></IonIcon>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <ExploreContainer name={match.params.name} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
