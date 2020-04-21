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
  import "./Register.css";
import { UserProviderState, withUser } from "../../providers/UserProvider";
  
  interface RegisterProps {
    user: UserProviderState;
  }
  
  interface RegisterState {
    email: string;
    password: string;
  }
  
  const RegisterPageComponent: React.FunctionComponent<RegisterProps> = (
    props: RegisterProps
  ) => {
    const [state, setState] = useState<RegisterState>({ email: "", password: "" });
  
    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
  
      if (props.user.type === "Ready") {
        props.user.register(state.email, state.password);
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
  