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
import React, { useEffect } from "react";
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
        <IonRow>
          {state.paymentPlans?.map(
            (paymentPlan: PaymentPlan, index: number) => {
              return (
                <IonCol key={index}>
                  <IonCard
                    button
                    color={
                      state?.selectedPaymentPlan?._id === paymentPlan._id &&
                      state.checkoutUsingPaymentPlan
                        ? "primary"
                        : undefined
                    }
                    onClick={() =>
                      dispatch &&
                      dispatch({ type: "usePlan", plan: paymentPlan })
                    }
                  >
                    <IonCardHeader>
                      <IonCardTitle>Price: {paymentPlan.price}</IonCardTitle>
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
