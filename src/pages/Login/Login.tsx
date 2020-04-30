import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonInput,
  IonButton,
  IonSpinner,
  IonAlert,
} from "@ionic/react";
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";
import {
  GoogleLoginResponse,
  GoogleLogin,
  GoogleLoginResponseOffline,
} from "react-google-login";
import React, { useState } from "react";
import { UserProviderState, withUser } from "../../providers/UserProvider";
import { withRouter, RouteComponentProps } from "react-router-dom";

import "./Login.css";

interface LoginProps extends RouteComponentProps {
  user: UserProviderState;
}

interface LoginState {
  email: string;
  password: string;
}

const LoginPageComponent: React.FunctionComponent<LoginProps> = (
  props: LoginProps
) => {
  const [state, setState] = useState<LoginState>({ email: "", password: "" });
  const [showAlert, setShowAlert] = useState<string | false>(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (props.user.type === "Ready") {
      const result = await props.user.login(state.email, state.password);

      if (result === null) {
        setShowAlert("Error logging in. Try again.");
      } else {
        props.history.push("/home");
      }
    }
  };

  const onFacebookSubmit = async (result: ReactFacebookLoginInfo) => {
    if (props.user.type === "Ready") {
      try {
        await props.user.facebookLogin(result.accessToken);
        props.history.push("/home");
      } catch (e) {
        setShowAlert("Login failed");
      }
    } else {
      setShowAlert("Login failed");
    }
  };

  const onGoogleSubmit = async (
    result: GoogleLoginResponse | GoogleLoginResponseOffline
  ) => {
    if ((result as any).code === undefined && props.user.type === "Ready") {
      try {
        await props.user.googleLogin(
          (result as GoogleLoginResponse).accessToken
        );
        props.history.push("/home");
      } catch (e) {
        setShowAlert("Login failed");
      }
    } else {
      setShowAlert("Login failed");
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>Login</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        <IonAlert
          isOpen={showAlert !== false}
          onDidDismiss={() => setShowAlert(false)}
          header={"Error"}
          message={showAlert !== false ? showAlert : ""}
          buttons={["Ok"]}
        />
        {props.user.type === "Ready" ? (
          <form className="LoginPage__container" onSubmit={onSubmit}>
            <IonInput
              placeholder="Email"
              type={"email"}
              value={state.email}
              onIonInput={(e) =>
                setState((prevState) => {
                  prevState.email = (e.target as HTMLInputElement).value;
                  return prevState;
                })
              }
            />
            <IonInput
              placeholder="Password"
              type={"password"}
              value={state.password}
              onIonInput={(e) =>
                setState((prevState) => {
                  prevState.password = (e.target as HTMLInputElement).value;
                  return prevState;
                })
              }
            />
            <IonButton type={"submit"}>{"Login"}</IonButton>
            <FacebookLogin
              appId="662636214298507"
              fields="name,email,picture"
              callback={onFacebookSubmit}
            />
            <GoogleLogin
              clientId="1014596992798-h2tr5h1lts32p6ld93qtpvc0b17c88p6.apps.googleusercontent.com"
              buttonText="Login"
              onSuccess={onGoogleSubmit}
              onFailure={(result) => {
                setShowAlert("Login failed");
                console.error(result);
              }}
            />
          </form>
        ) : (
          <IonSpinner />
        )}
      </IonContent>
    </IonPage>
  );
};

export const LoginPage = withRouter(withUser(LoginPageComponent));
