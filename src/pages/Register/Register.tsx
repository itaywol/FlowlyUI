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
import "./Register.css";
import { UserProviderState, withUser } from "../../providers/UserProvider";
import { Redirect } from "react-router-dom";

interface RegisterProps {
  user: UserProviderState;
}

interface RegisterState {
  email: string;
  password: string;
  nickName: string;
  redirect?: string;
}

const RegisterPageComponent: React.FunctionComponent<RegisterProps> = (
  props: RegisterProps
) => {
  const [state, setState] = useState<RegisterState>({
    email: "",
    password: "",
    nickName: "",
    redirect: undefined
  });
  const [showAlert, setShowAlert] = useState<string | false>(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (props.user.type === "Ready") {
      try {
        await props.user.register({
          email: state.email,
          password: state.password,
          nickName: state.nickName
        });

        setState(prevState => {
          prevState.redirect = "/home";
          return prevState;
        });
      } catch (e) {
        switch (e.response.status) {
          case 401:
            setShowAlert("Error creating user, try another nickname or email.");
            break;
        }
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
          <IonTitle>{"Register"}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent>
        {state.redirect !== undefined ? <Redirect to={state.redirect} /> : null}
        <IonAlert
          isOpen={showAlert !== false}
          onDidDismiss={() => setShowAlert(false)}
          header={"Error"}
          message={showAlert !== false ? showAlert : ""}
          buttons={["Ok"]}
        />
        {props.user.type === "Ready" ? (
          <form className="RegisterPage__container" onSubmit={onSubmit}>
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
            <IonInput
              placeholder="Nickname"
              type={"text"}
              value={state.nickName}
              onIonInput={e =>
                setState(prevState => {
                  prevState.nickName = (e.target as HTMLInputElement).value;
                  return prevState;
                })
              }
            />
            <IonButton type={"submit"}>{"Register"}</IonButton>
          </form>
        ) : (
          <IonSpinner />
        )}
      </IonContent>
    </IonPage>
  );
};

export const RegisterPage = withUser(RegisterPageComponent);
