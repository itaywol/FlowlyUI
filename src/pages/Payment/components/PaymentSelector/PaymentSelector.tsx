import { IonContent, IonButton } from "@ionic/react";
import React from "react";
import { WithPaymentProps } from "../../../../providers/PaymentProvider";
import DropIn from "braintree-web-drop-in-react";

export const PaymentSelector: React.FunctionComponent<
    WithPaymentProps & { handleNext: () => void; handlePrev: () => void }
> = ({ payment, handleNext, handlePrev }) => {
    const {
        state,
        setInstance,
        fetchToken,
        checkout,
        fetchPaymentPlans,
    } = payment;
    return (
        <IonContent fullscreen>
            <DropIn
                options={{
                    authorization: state?.paymentToken?.clientToken,
                    paymentOptionPriority: ["paypal", "card"],
                    paypal: {
                        intent: "authorize",
                        flow: "checkout",
                        amount: state.checkoutUsingPaymentPlan
                            ? state.selectedPaymentPlan?.price
                            : state.specifyPaymentAmount,
                        currency: "USD",
                    },
                }}
                onInstance={(instance: any) => {
                    if (setInstance) setInstance(instance);
                }}
            ></DropIn>
            <IonButton
                fill="solid"
                style={{ width: "100%" }}
                onClick={() => {
                    if (checkout !== null) {
                        checkout();
                        if (handleNext) handleNext();
                    }
                }}
            >
                Submit Payment
            </IonButton>
            <IonButton
                color="light"
                style={{ width: "100%" }}
                onClick={handlePrev}
            >
                Wait i want to change the amount
            </IonButton>
        </IonContent>
    );
};
