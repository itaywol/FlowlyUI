import React, { useState } from "react";
import { RouteComponentProps, Route, Redirect } from "react-router-dom";
import { homeOutline, compassOutline, cameraOutline } from "ionicons/icons";
import {
  IonTabs,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
} from "@ionic/react";
import Page from "../pages/Page";

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}
const appPages: AppPage[] = [
  {
    title: "Home",
    url: "/Home",
    iosIcon: homeOutline,
    mdIcon: homeOutline,
  },
  {
    title: "Explore",
    url: "/Explore",
    iosIcon: compassOutline,
    mdIcon: compassOutline,
  },
  {
    title: "Channel",
    url: "/Channel",
    iosIcon: cameraOutline,
    mdIcon: cameraOutline,
  },
];

const Tabs: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState("");
  return (
    <IonTabs>
      <IonRouterOutlet id="tabs">
        <Route
          path="/:name"
          render={(props) => {
            setSelectedPage(props.match.params.name);
            return <Page {...props} />;
          }}
          exact={true}
        />
        <Route path="/" render={() => <Redirect to="/Home" />} exact={true} />
      </IonRouterOutlet>
      <IonTabBar slot="bottom" translucent>
        {appPages.map((appPage, index) => {
          return (
            <IonTabButton key={index} tab={appPage.title} href={appPage.url}>
              <IonIcon icon={appPage.iosIcon} />
              <IonLabel>{appPage.title}</IonLabel>
            </IonTabButton>
          );
        })}
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
