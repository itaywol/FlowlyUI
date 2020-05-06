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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faDollarSign } from "@fortawesome/free-solid-svg-icons";
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
            <FontAwesomeIcon
                style={{ marginLeft: 4, fontSize: "3em", margin: "20px" }}
                icon={faCoins}
                color="#FFDF00"
            />
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
