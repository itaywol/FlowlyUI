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
  IonGrid,
  IonCol,
  IonRow,
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

interface PaymentPlan {
  price: number;
  worth: {
    balance: number;
    bonus: number;
    total: number;
  };
}

const PaymentPageContent: React.FunctionComponent<ProfileProps> = (
  props: ProfileProps
) => {
  const [getToken, respToken] = useBraintree();
  const [instance, setInstance] = useState();
  const [state, setState] = useImmer<{
    nonce: string | undefined;
    payWithPaymentPlan: boolean;
    paymentPlans: PaymentPlan[] | undefined;
    selectedPlan: number | undefined;
    paymentFreeAmount: number;
  }>({
    nonce: "",
    paymentPlans: undefined,
    selectedPlan: undefined,
    payWithPaymentPlan: true,
    paymentFreeAmount: 0,
  });

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
    if (!state.paymentPlans) {
      Axios.get("/api/payment/plan").then((response) => {
        setState((draft) => {
          draft.paymentPlans = response.data;
        });
      });
    }
    if (state.nonce && state.selectedPlan && state.paymentPlans) {
      if (state.payWithPaymentPlan)
        Axios.post("/api/payment/checkout", {
          payment_method_nounce: state.nonce,
          paymentPlanID: state.paymentPlans[state.selectedPlan],
        });
      else
        Axios.post("/api/payment/checkout", {
          payment_method_nounce: state.nonce,
          paymentAmount: state.paymentPlans[state.selectedPlan],
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
          <IonCardContent>
            <IonGrid>
              <IonRow>
                {state.paymentPlans?.map(
                  (paymentPlan: PaymentPlan, index: number) => {
                    return (
                      <IonCol key={index}>
                        <IonCard
                          button
                          color={
                            state.selectedPlan === index ? "primary" : undefined
                          }
                          onClick={() =>
                            setState((draft) => {
                              draft.selectedPlan = index;
                              draft.payWithPaymentPlan = true;
                            })
                          }
                        >
                          <IonCardHeader>
                            <IonCardTitle>
                              Price: {paymentPlan.price}
                            </IonCardTitle>
                            <IonCardSubtitle>
                              eBalance Worth: {paymentPlan.worth.total}
                            </IonCardSubtitle>
                          </IonCardHeader>
                        </IonCard>
                      </IonCol>
                    );
                  }
                )}
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>Free amount payment</IonCardTitle>
                    </IonCardHeader>
                  </IonCard>
                </IonCol>
              </IonRow>
              <IonRow>
                <IonCol>
                  <IonCard>
                    <IonCardHeader>
                      <IonCardTitle>Summary</IonCardTitle>
                    </IonCardHeader>
                  </IonCard>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
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
