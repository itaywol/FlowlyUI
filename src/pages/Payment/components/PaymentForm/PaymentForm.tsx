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

const PaymentFormContent: React.FunctionComponent = () => {
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
                    color={state.selectedPlan === index ? "primary" : undefined}
                    onClick={() =>
                      setState((draft) => {
                        draft.selectedPlan = index;
                        draft.payWithPaymentPlan = true;
                      })
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
  );
};

export const PaymentForm: React.FunctionComponent = () => {
  return (
    <>
      <PaymentFormContent />
    </>
  );
};

