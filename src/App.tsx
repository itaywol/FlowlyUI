import Menu from "./components/Menu";
import React, { useState } from "react";
import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route } from "react-router-dom";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { UserProvider } from "./providers/UserProvider";
import { LoginPage } from "./pages/Login/Login";
import { RegisterPage } from "./pages/Register/Register";
import { ProfilePage } from "./pages/Profile/Profile";
import { PaymentPage } from "./pages/Payment/Payment";
import { StreamPage } from "./pages/Stream/Stream";
import { HomePage } from "./pages/Home/Home";

const App: React.FC = () => {
  const [selectedPage, setSelectedPage] = useState("");

  return (
    <UserProvider>
      <IonApp>
        <IonReactRouter>
          <IonSplitPane contentId="main">
            <Menu selectedPage={selectedPage} />
            <IonRouterOutlet id="main">
            <Route
                path="/home"
                render={() => {
                  setSelectedPage("home");
                  return <HomePage />;
                }}
                exact={true}
              />
              <Route
                path="/login"
                render={() => {
                  setSelectedPage("login");
                  return <LoginPage />;
                }}
                exact={true}
              />
              <Route
                path="/register"
                render={() => {
                  setSelectedPage("register");
                  return <RegisterPage />;
                }}
                exact={true}
              />
              <Route
                path="/profile"
                render={() => {
                  setSelectedPage("profile");
                  return <ProfilePage />;
                }}
                exact={true}
              />
              <Route
                path="/payment"
                render={() => {
                  setSelectedPage("payment");
                  return <PaymentPage />;
                }}
                exact={true}
              />
              <Route
                path="/channel/:nickName"
                render={() => {
                  setSelectedPage("channel");
                  return <StreamPage />;
                }}
                exact={false}
              />
              <Route
                path="/"
                render={() => <Redirect to="/home" />}
                exact={true}
              />
            </IonRouterOutlet>
          </IonSplitPane>
        </IonReactRouter>
      </IonApp>
    </UserProvider>
  );
};

export default App;
