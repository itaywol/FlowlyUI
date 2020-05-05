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
import React, { useState, useEffect } from "react";
import "./Register.css";
import { UserProviderState, withUser } from "../../providers/UserProvider";
import { Redirect, withRouter, RouteComponentProps } from "react-router-dom";
import { SocialAuth } from "../../components/SocialAuth";

interface RegisterProps extends RouteComponentProps {
  user: UserProviderState;
}

interface RegisterState {
  email: string;
  password: string;
  nickName: string;
}

const RegisterPageComponent: React.FunctionComponent<RegisterProps> = (
  props: RegisterProps
) => {
  const [state, setState] = useState<RegisterState>({
    email: "",
    password: "",
    nickName: ""
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

        props.history.push("/home");
        setShowAlert("Account created successfully");
      } catch (e) {
        switch (e.response.status) {
          case 401:
            setShowAlert("Error creating user, try another nickname or email.");
            break;
          default:
            setShowAlert("Unknown error, might be internet connection.");
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
        <IonAlert
          isOpen={showAlert !== false}
          onDidDismiss={() => setShowAlert(false)}
          header={"Error"}
          message={showAlert !== false ? showAlert : ""}
          buttons={["Ok"]}
        />
        <form className="RegisterPage__container" onSubmit={onSubmit} autoComplete="on">
          <IonInput
            placeholder="Email"
            type={"email"}
            name="email"
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
            name="password"
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
          <SocialAuth />
        </form>
      </IonContent>
    </IonPage>
  );
};

export const RegisterPage = withRouter(withUser(RegisterPageComponent));
