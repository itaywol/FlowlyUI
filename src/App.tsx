import { IonApp } from "@ionic/react";
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
import React from "react";
import { MainPage } from "./components/MainPage/MainPage";
import { UserProvider } from "./providers/user/UserProvider";
/* Theme variables */
import "./theme/variables.css";

// TODO: authentication check based on request
// TODO: landed check based on localStorage
const App: React.FC = () => {
  return (
    <IonApp>
      <UserProvider>
        <MainPage />
      </UserProvider>
    </IonApp>
  );
};

export default App;
