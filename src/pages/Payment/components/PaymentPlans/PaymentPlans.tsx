import React, { FC, useContext } from "react";
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
import comet from "../../../../assets/svg/comet.svg";
export const PaymentPlanComponent: FC<
  { plan: PaymentPlan } & WithPaymentProps
> = ({ plan, payment: { state, dispatch } }) => {
  return (
    <IonCard
      button
      color={
        state.selectedPaymentPlan?._id === plan._id &&
        state.checkoutUsingPaymentPlan
          ? "warning"
          : undefined
      }
      onClick={() => dispatch && dispatch({ type: "usePlan", plan: plan })}
    >
      <IonCardHeader style={{ textAlign: "center" }}>
        <IonCardTitle>{plan.worth.total}</IonCardTitle>
        <img src={comet} width="50px" style={{ color: "red" }}></img>
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
        <PaymentPlanComponent key={index} plan={plan} payment={payment} />
      ))}
    </>
  );
};
