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
    IonCardTitle,
} from "@ionic/react";
import React, { useEffect } from "react";
import "./Payment.scss";
import DropIn from "braintree-web-drop-in-react";
import {
    withPayment,
    WithPaymentProps,
    PaymentProvider,
} from "../../providers/PaymentProvider";
import { PaymentForm } from "./components/PaymentForm/PaymentForm";

const PaymentPageContent: React.FunctionComponent<WithPaymentProps> = (
    props: WithPaymentProps
) => {
    const {
        state,
        setInstance,
        fetchToken,
        checkout,
        fetchPaymentPlans,
    } = props.payment;
    useEffect(() => {
        if (fetchToken && !state.paymentToken) fetchToken();
        if (!state.paymentPlans && fetchPaymentPlans) fetchPaymentPlans();
    }, [state]);

    return (
        <>
            <IonCard>
                {state.checkoutCalled && state.checkoutLoading && (
                    <IonSpinner />
                )}
                {state.checkoutSuccess && (
                    <IonCardHeader>
                        <IonCardTitle>Transaction Success</IonCardTitle>
                    </IonCardHeader>
                )}
                {state.checkoutCalled &&
                    !state.checkoutLoading &&
                    !state.checkoutSuccess && (
                        <IonCardHeader>
                            <IonCardTitle>Trasnaction Failed</IonCardTitle>
                        </IonCardHeader>
                    )}
                {!state.checkoutCalled && !state.checkoutLoading && (
                    <>
                        <IonCardHeader>
                            <IonCardTitle>Charge your account</IonCardTitle>
                        </IonCardHeader>
                        <PaymentForm {...props} />
                        <IonCardContent>
                            {state.paymentToken?.clientToken &&
                                (state?.specifyPaymentAmount ||
                                    state?.selectedPaymentPlan?.price) && (
                                    <>
                                        <DropIn
                                            options={{
                                                authorization:
                                                    state?.paymentToken
                                                        ?.clientToken,
                                                paymentOptionPriority: [
                                                    "paypal",
                                                    "card",
                                                ],
                                                paypal: {
                                                    intent: "authorize",
                                                    flow: "checkout",
                                                    amount: state.checkoutUsingPaymentPlan
                                                        ? state
                                                              .selectedPaymentPlan
                                                              ?.price
                                                        : state.specifyPaymentAmount,
                                                    currency: "USD",
                                                },
                                            }}
                                            onInstance={(instance: any) => {
                                                if (setInstance)
                                                    setInstance(instance);
                                            }}
                                        ></DropIn>
                                        <IonButton
                                            fill="solid"
                                            style={{ width: "100%" }}
                                            onClick={() => {
                                                if (checkout !== null)
                                                    checkout();
                                            }}
                                        >
                                            Submit Payment
                                        </IonButton>
                                    </>
                                )}
                        </IonCardContent>
                    </>
                )}
            </IonCard>
        </>
    );
};

const PaymentPageWithPayment = withPayment(PaymentPageContent);

const PaymentPageComponent: React.FunctionComponent = () => {
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
                <PaymentProvider>
                    <PaymentPageWithPayment />
                </PaymentProvider>
            </IonContent>
        </IonPage>
    );
};

export const PaymentPage = PaymentPageComponent;
