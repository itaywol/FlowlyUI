import React, { FC, useContext } from "react";
import "./PaymentsPlans.scss";
import {
    PaymentPlan,
    WithPaymentProps,
    PaymentContext,
} from "../../../../providers/PaymentProvider";
import {
    IonCard,
    IonCardHeader,
    IonCardTitle,
    IonIcon,
    IonCardContent,
    IonText,
} from "@ionic/react";
import { ReactComponent as CoinsSvg } from "../../../../assets/svg/coins.svg";
export const PaymentPlanComponent: FC<
    { plan: PaymentPlan } & WithPaymentProps
> = ({ plan, payment: { state, dispatch } }) => {
    return (
        <IonCard
            button
            color={
                state.selectedPaymentPlan?._id === plan._id &&
                state.checkoutUsingPaymentPlan
                    ? "light"
                    : undefined
            }
            onClick={() =>
                dispatch && dispatch({ type: "usePlan", plan: plan })
            }
        >
            <CoinsSvg className="payments-plans-coins" />
            <IonCardHeader style={{ textAlign: "center" }}>
                <IonCardTitle>{plan.worth.total} coins</IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
                <IonText>For {plan.price}$</IonText>
            </IonCardContent>
        </IonCard>
    );
};

export const PaymentPlans: FC = () => {
    const payment = useContext(PaymentContext);
    return (
        <>
            {payment.state?.paymentPlans?.map((plan, index) => (
                <PaymentPlanComponent
                    key={index}
                    plan={plan}
                    payment={payment}
                />
            ))}
        </>
    );
};
