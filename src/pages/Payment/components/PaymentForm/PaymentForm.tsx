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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faDollarSign } from "@fortawesome/free-solid-svg-icons";

export const PaymentForm: React.FunctionComponent<WithPaymentProps> = ({
    payment: { state, dispatch },
}: WithPaymentProps) => {
    return (
        <IonCardContent>
            <IonGrid fixed>
                {state.paymentPlans && state.paymentPlans.length > 0 && (
                    <>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    Select one of our coin plans
                                </IonCardTitle>
                            </IonCardHeader>
                        </IonCard>
                        <IonRow>
                            <PaymentPlans />
                        </IonRow>
                    </>
                )}
                <IonRow>
                    <IonCol>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>
                                    Free amount selection
                                </IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonLabel position="floating">
                                    Amount in USD
                                </IonLabel>
                                <IonInput
                                    type="number"
                                    inputmode="numeric"
                                    min={"10"}
                                    placeholder={"10"}
                                    color={
                                        !state.checkoutUsingPaymentPlan
                                            ? "primary"
                                            : undefined
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
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
                <IonRow>
                    <IonCol>
                        <IonCard>
                            <IonCardHeader>
                                <IonCardTitle>Summary</IonCardTitle>
                            </IonCardHeader>
                            <IonCardContent>
                                <IonText>
                                    <h3>
                                        Total Payment:{" "}
                                        {state.checkoutUsingPaymentPlan
                                            ? state.selectedPaymentPlan?.price
                                            : state.specifyPaymentAmount}{" "}
                                        $
                                    </h3>
                                </IonText>
                                <IonText>
                                    <h2>
                                        Earn:{" "}
                                        {state.checkoutUsingPaymentPlan
                                            ? state.selectedPaymentPlan?.worth
                                                  .total
                                            : state.specifyPaymentAmount}
                                        <FontAwesomeIcon
                                            icon={faCoins}
                                            style={{ marginLeft: 4 }}
                                            color="#FFDF00"
                                        />
                                    </h2>
                                </IonText>
                            </IonCardContent>
                        </IonCard>
                    </IonCol>
                </IonRow>
            </IonGrid>
        </IonCardContent>
    );
};
