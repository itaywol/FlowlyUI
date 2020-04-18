import { IonPage, IonRouterOutlet, IonSplitPane } from "@ionic/react";
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
import React, { useState, PropsWithChildren, useEffect } from "react";
import { Redirect, Route } from "react-router";
import Page from "../../pages/Page";
import Tabs from "../../tabs/tabs";
import Menu from "../Menu";
/* Theme variables */
import "../../theme/variables.css";
import LandingPage from "../LandingPage/LandingPage";
import { AuthenticationPage } from "../AuthenticationPage/AuthenticationPage";
import { useUserContext } from "../../providers/user/UserProvider";

export const MainPage: React.FC<PropsWithChildren<any>> = ({ children }) => {
  const [selectedPage, setSelectedPage] = useState<string>("");
  const [landed, setLanded] = useState<boolean>(
    JSON.parse(localStorage.getItem("performaLanded") || "false")
  );
  const { user, refresh } = useUserContext();
  const [isAuth, setAuth] = useState<boolean>(false);

  useEffect(() => {
    if (user) setAuth(true);
    else setAuth(false);
  }, [user]);

  return (
    <>
      {!landed && <LandingPage continue={setLanded} />}
      {landed && !isAuth && <AuthenticationPage />}
      {isAuth && (
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
    </>
  );
};
