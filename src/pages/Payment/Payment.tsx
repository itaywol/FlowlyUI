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
    IonSlides,
    IonSlide,
} from "@ionic/react";
import React, { useEffect, useRef, FC } from "react";
import "./Payment.scss";
import {
    withPayment,
    WithPaymentProps,
    PaymentProvider,
} from "../../providers/PaymentProvider";
import { PaymentForm } from "./components/PaymentForm/PaymentForm";
import {
    WithUserProps,
    withUser,
    UserProviderState,
} from "../../providers/UserProvider";
import { Redirect } from "react-router";
import { PaymentSelector } from "./components/PaymentSelector/PaymentSelector";

const PaymentPageContent: React.FunctionComponent<
    WithPaymentProps & WithUserProps
> = (props) => {
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

    const slider = useRef<HTMLIonSlidesElement | null>(null);

    const handleNext = () => {
        slider.current?.lockSwipes(false);
        if (slider.current) slider.current.slideNext();
        slider.current?.lockSwipes(true);
    };
    const handlePrev = () => {
        slider.current?.lockSwipes(false);
        if (slider.current) slider.current.slidePrev();
        slider.current?.lockSwipes(true);
    };

    const lockSlides = () => {
        if (slider.current) slider.current.lockSwipes(true);
    };

    const checkPayments = () => {
        return (
            state.specifyPaymentAmount >= 10 ||
            state.selectedPaymentPlan?.price !== undefined
        );
    };

    const refresh = () => {
        if (props.user.type === "Ready") props.user.refresh();
    };

    useEffect(() => {
        if (state.paymentToken?.success === false) console.log("not token");
    }, [state.paymentToken?.success]);

    if (!state.paymentToken?.clientToken)
        return (
            <IonContent fullscreen>
                <IonSpinner />
            </IonContent>
        );

    return (
        <IonSlides
            pager={false}
            scrollbar={true}
            ref={slider}
            style={{ height: "100%" }}
            onIonSlidesDidLoad={() => lockSlides()}
        >
            <IonSlide>
                {!state.checkoutCalled && !state.checkoutLoading && (
                    <IonContent fullscreen>
                        <PaymentForm {...props} />
                        <IonButton
                            color="primary"
                            style={{ width: "100%" }}
                            disabled={!checkPayments()}
                            onClick={() => {
                                if (checkPayments()) handleNext();
                            }}
                        >
                            Continue
                        </IonButton>
                    </IonContent>
                )}
            </IonSlide>
            <IonSlide>
                {(state?.specifyPaymentAmount ||
                    state?.selectedPaymentPlan?.price) && (
                    <PaymentSelector
                        {...props}
                        handleNext={handleNext}
                        handlePrev={handlePrev}
                    />
                )}
            </IonSlide>
            <IonSlide>
                <IonCard>
                    {state.checkoutLoading && (
                        <IonCardContent>
                            <IonSpinner />
                        </IonCardContent>
                    )}
                    {state.checkoutCalled && state.checkoutSuccess && (
                        <IonCardHeader>
                            <IonCardTitle>Transaction Success</IonCardTitle>
                            <IonButton
                                routerLink={"/profile"}
                                onClick={refresh}
                            >
                                Go to your profile
                            </IonButton>
                        </IonCardHeader>
                    )}
                    {state.checkoutCalled &&
                        !state.checkoutLoading &&
                        !state.checkoutSuccess && (
                            <IonCardHeader>
                                <IonCardTitle>Transaction Failed</IonCardTitle>
                                <IonButton
                                    routerLink={"/payment"}
                                    onClick={refresh}
                                >
                                    Try Again
                                </IonButton>
                            </IonCardHeader>
                        )}
                </IonCard>
            </IonSlide>
        </IonSlides>
    );
};

const PaymentPageWithPayment = withUser(withPayment(PaymentPageContent));

interface PaymentPageProps {
    user: UserProviderState;
}
const PaymentPageComponent: React.FunctionComponent<PaymentPageProps> = (
    props: PaymentPageProps
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

                    <IonContent fullscreen class="ion-padding" scrollY={false}>
                        <PaymentProvider>
                            <PaymentPageWithPayment />
                        </PaymentProvider>
                    </IonContent>
                </IonPage>
            );
        case "Failed":
            return <div>Error getting user</div>;
    }
};

export const PaymentPage = withUser(PaymentPageComponent);
