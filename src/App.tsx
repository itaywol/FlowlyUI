import {
  IonApp,
  IonContent,
  IonSlides,
  IonSlide,
  IonPage,
  IonHeader,
  IonTitle,
  IonButton,
  IonSplitPane,
  IonMenu,
  IonRouterOutlet,
  IonModal,
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
import React, { useState } from "react";
import Tabs from "./tabs/tabs";
/* Theme variables */
import "./theme/variables.css";
import Menu from "./components/Menu";
import { Route, Redirect } from "react-router";
import Page from "./pages/Page";

const LandingPage: React.FC<{ continue: any }> = (props) => {
  return (
    <IonContent fullscreen class="ion-padding" scroll-y={false}>
      <IonSlides
        pager={true}
        options={{ initialSlide: 0, speed: 400 }}
        style={{ height: "100%" }}
      >
        <IonSlide>
          <div className="slide">
            <h2>Welcome</h2>
          </div>
        </IonSlide>
        <IonSlide>
          <h1>This is Performa</h1>
        </IonSlide>
        <IonSlide>
          <IonButton
            onClick={() => {
              localStorage.setItem("performaLanded", "true");
              props.continue(true);
            }}
          >
            Continue!
          </IonButton>
        </IonSlide>
      </IonSlides>
    </IonContent>
  );
};

// TODO: authentication check based on request
// TODO: landed check based on localStorage
const App: React.FC = () => {
  const [landed, setLanded] = useState<boolean>(false);
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [isAuthenticated, setAuthenticated] = useState<boolean>(false);
  return (
    <IonApp>
      {!landed && !isAuthenticated && <LandingPage continue={setLanded} />}
      {landed && !isAuthenticated && (
        <IonContent>
          <IonButton onClick={() => setAuthenticated(true)}>
            yada yada yada perform login or register
          </IonButton>
        </IonContent>
      )}
      {landed && isAuthenticated && (
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
