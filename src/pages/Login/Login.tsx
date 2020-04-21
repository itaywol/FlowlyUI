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
  IonSpinner
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
}

const LoginPageComponent: React.FunctionComponent<LoginProps> = (
  props: LoginProps
) => {
  const [state, setState] = useState<LoginState>({ email: "", password: "" });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (props.user.type === "Ready") {
      props.user.login(state.email, state.password);
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
