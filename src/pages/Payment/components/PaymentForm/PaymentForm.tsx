import {
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonGrid,
  IonRow,
  IonInput,
  IonLabel,
  IonText,
} from "@ionic/react";
import React from "react";
import { PaymentPlans } from "../PaymentPlans/PaymentPlans";
import {
  WithPaymentProps,
  PaymentPlan,
} from "../../../../providers/PaymentProvider";

export const PaymentForm: React.FunctionComponent<WithPaymentProps> = ({
  payment: { state, dispatch },
}: WithPaymentProps) => {
  return (
    <IonCardContent>
      <IonGrid>
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Select one of our payment plans</IonCardTitle>
          </IonCardHeader>
        </IonCard>
        <IonRow>
          <PaymentPlans />
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Free amount selection</IonCardTitle>
              </IonCardHeader>
              <IonCardContent>
                <IonLabel position="floating">Amount in NIS</IonLabel>
                <IonInput
                  type="number"
                  inputmode="numeric"
                  min={"0"}
                  color={
                    !state.checkoutUsingPaymentPlan ? "primary" : undefined
                  }
                  onIonChange={(e: CustomEvent<any>) => {
                    dispatch &&
                      e.detail.value != null &&
                      dispatch({
                        type: "useFreeAmount",
                        amount: e.detail.value,
                      });
                  }}
                ></IonInput>
                <IonText>eBalance Worth:{state.specifyPaymentAmount}</IonText>
              </IonCardContent>
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow>
          <IonCol>
            <IonCard>
              <IonCardHeader>
                <IonCardTitle>Summary</IonCardTitle>
                <IonCardContent>
                  Total Payment:{" "}
                  {state.checkoutUsingPaymentPlan
                    ? state.selectedPaymentPlan?.price
                    : state.specifyPaymentAmount}{" "}
                  $
                </IonCardContent>
              </IonCardHeader>
            </IonCard>
          </IonCol>
        </IonRow>
      </IonGrid>
    </IonCardContent>
  );
};
