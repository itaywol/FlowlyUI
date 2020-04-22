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
  IonAlert
} from "@ionic/react";
import React, { useState } from "react";
import "./Login.css";
import { UserProviderState, withUser } from "../../providers/UserProvider";

interface LoginProps {
  user: UserProviderState;
}

interface LoginState {
  email: string;
  password: string;
  redirect?: string;
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
        setState(prevState => {
          prevState.redirect = "/home";
          return prevState;
        });
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle>{"Login"}</IonTitle>
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
              onIonInput={e =>
                setState(prevState => {
                  prevState.email = (e.target as HTMLInputElement).value;
                  return prevState;
                })
              }
            />
            <IonInput
              placeholder="Password"
              type={"password"}
              value={state.password}
              onIonInput={e =>
                setState(prevState => {
                  prevState.password = (e.target as HTMLInputElement).value;
                  return prevState;
                })
              }
            />
            <IonButton type={"submit"}>{"Login"}</IonButton>
          </form>
        ) : (
          <IonSpinner />
        )}
      </IonContent>
    </IonPage>
  );
};

export const LoginPage = withUser(LoginPageComponent);
