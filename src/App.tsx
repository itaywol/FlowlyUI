import {
  IonApp,
  IonButton,
  IonContent,
  IonPage,
  IonRouterOutlet,
  IonSlide,
  IonSlides,
  IonSplitPane,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router";
import Menu from "./components/Menu";
import useAuthenticationValidation from "./hooks/useAuthenticationValidation";
import Page from "./pages/Page";
import Tabs from "./tabs/tabs";
/* Theme variables */
import "./theme/variables.css";
import LandingPage from "./components/LandingPage/LandingPage";
import useFetch from "./hooks/useFetch";

// TODO: authentication check based on request
// TODO: landed check based on localStorage
const App: React.FC = () => {
  const [landed, setLanded] = useState<boolean>(
    JSON.parse(localStorage.getItem("performaLanded") || "false")
  );
  const [selectedPage, setSelectedPage] = useState<string>("");
  const isAuthenticated = useAuthenticationValidation() || false;
  return (
    <IonApp>
      {!landed && <LandingPage continue={setLanded} />}
      {landed && !isAuthenticated && <IonContent>login or register</IonContent>}
      {isAuthenticated && (
        <IonReactRouter>
          <IonRouterOutlet id="main">
            <Route
              path="/:name"
              render={(props) => {
                setSelectedPage(props.match.params.name);
                return <Page {...props} />;
              }}
              exact={true}
            />
            <Route
              path="/"
              render={() => <Redirect to="/Home" />}
              exact={true}
            />
          </IonRouterOutlet>
          <IonSplitPane contentId="main">
            <Menu selectedPage={selectedPage} />
            <IonPage id="main">
              <Tabs />
            </IonPage>
          </IonSplitPane>
        </IonReactRouter>
      )}
    </IonApp>
  );
};

export default App;
