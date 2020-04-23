import {
  IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonPage,
  IonTitle,
  IonToolbar,
  IonSpinner,
  IonCard,
  IonCardHeader,
  IonCardContent,
  IonButton,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { useImmer } from "use-immer";
import React, { useEffect, useState } from "react";
import "./Payment.scss";
import { UserProviderState, withUser } from "../../providers/UserProvider";
import assertNever from "assert-never";
import { useBraintree } from "../../hooks/useBraintree";
import DropIn from "braintree-web-drop-in-react";
import Axios from "axios";

interface ProfileProps {
  user: UserProviderState;
}

const PaymentPageContent: React.FunctionComponent<ProfileProps> = (
  props: ProfileProps
) => {
  const [getToken, respToken] = useBraintree();
  const [instance, setInstance] = useState();
  const [state, setState] = useImmer<{
    nonce: string | undefined;
  }>({ nonce: "" });

  function doPayment() {
    if (instance) {
      instance?.requestPaymentMethod().then((response: any) =>
        setState((draft) => {
          draft.nonce = response.nonce;
        })
      );
    }
  }

  function updateInstance(instance: any) {
    if (instance) setInstance(instance);
  }

  useEffect(() => {
    if (!respToken.token) getToken();
    if (state.nonce) {
      Axios.post("/api/payment/checkout", {
        payment_method_nounce: state.nonce,
        paymentAmount: 10,
      });
    }
  }, [state.nonce]);

  if (props.user.type === "Loading" || props.user.type === "Failed")
    return <></>;

  return (
    <>
      {props.user.user && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Charge your account</IonCardTitle>
          </IonCardHeader>
          <IonCardContent></IonCardContent>
          <IonCardContent>
            {respToken.token && (
              <div>
                <DropIn
                  options={{ authorization: respToken.token }}
                  onInstance={(instance: any) => updateInstance(instance)}
                />
                <IonButton onClick={() => doPayment()}>
                  Submit Payment
                </IonButton>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      )}
    </>
  );
};

const PaymentPageComponent: React.FunctionComponent<ProfileProps> = (
  props: ProfileProps
) => {
  switch (props.user.type) {
    case "Loading":
      return (
        <IonPage>
          <IonSpinner />
        </IonPage>
      );
    case "Ready":
      return (
        <IonPage>
          <IonHeader>
            <IonToolbar>
              <IonButtons slot="start">
                <IonMenuButton />
              </IonButtons>
              <IonTitle>Payment</IonTitle>
            </IonToolbar>
          </IonHeader>

          <IonContent fullscreen class="ion-padding">
            <PaymentPageContent {...props} />
          </IonContent>
        </IonPage>
      );
    case "Failed":
      return <div>Error getting user</div>;
    default:
      assertNever(props.user);
  }
};

export const PaymentPage = withUser(PaymentPageComponent);
