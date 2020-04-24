import React, { createContext, Component, useContext, FC } from "react";
import Axios, { AxiosResponse } from "axios";
import produce, { Draft } from "immer";
import { Optionalize } from "../utils/Optionalize";
import { useImmerReducer } from "use-immer";

interface TokenResponse {
  clientToken: string;
  success: boolean;
}

interface PaymentPlan {
  _id: string;
  price: number;
  worth: {
    balance: number;
    bonus: number;
    total: number;
  };
}

declare namespace PaymentProviderState {
  interface Loading {
    type: "Loading";
    paymentToken: TokenResponse | null | undefined;
    paymentPlans: PaymentPlan[] | null | undefined;
  }
  interface Ready {
    type: "Ready";
    paymentToken: TokenResponse | null;
    paymentPlans?: PaymentPlan[] | null;
    braintreeInstance: any;
    paymentNonce: string;
    usePaymentPlan: boolean;
    specifyPaymentAmount: number;
  }
  interface Failed {
    type: "Failed";
    error: any;
  }
}
export type PaymentProviderState =
  | PaymentProviderState.Loading
  | PaymentProviderState.Ready
  | PaymentProviderState.Failed;

export const PaymentContext = createContext<PaymentProviderState>({
  type: "Loading",
  paymentToken: null,
  paymentPlans: null,
});

export const getPaymentPlans = produce(async (draft: PaymentProviderState) => {
  draft.paymentPlans = (
    await Axios.get<PaymentPlan[]>("/api/payment/plan")
  ).data;
});

export const checkout = produce(async (draft: PaymentProviderState) => {
  if (draft.braintreeInstance) {
    draft.braintreeInstance.requestPaymentMethod().then((response: any) => {
      draft.paymentNonce = response.nonce;
    });
  }
});

const PaymentProviderInitialState: PaymentProviderState = {
  type: "Ready",
};

export type paymentReducerActions =
  | { type: "getToken" }
  | { type: "getPaymentPlans" }
  | { type: "instance"; instance: any }
  | { type: "nonce"; nonce: string }
  | { type: "specificAmount"; amount: number }
  | { type: "planSelected"; planID: string };

const paymentReducer = async (
  draft: PaymentProviderState,
  action: paymentReducerActions
) => {
  if (draft.type === "Loading")
    switch (action.type) {
      case "getToken":
        return (draft.paymentToken = (
          await Axios.post<TokenResponse | null>("/api/payment/token")
        ).data);
    }
  if (draft.type === "Ready")
    switch (action.type) {
      case "instance": {
        if (action.type === "instance")
          draft.braintreeInstance = action.instance;
        break;
      }
      case "nonce": {
        if (action.type === "nonce") draft.paymentNonce = action.nonce;
        break;
      }
      case "planSelected": {
      }
    }
};

const curriedPaymentReducer = produce(paymentReducer);

export const PaymentProvider: FC = () => {
  const [state, dispath] = useImmerReducer(
    curriedPaymentReducer,
    PaymentProviderInitialState
  );
  return <PaymentContext.Provider value={}></PaymentContext.Provider>;
};

export interface WithPaymentProps {
  paymentProps: PaymentProviderState;
}

export function withPayment<T extends WithPaymentProps = WithPaymentProps>(
  WrappedComponent: React.ComponentType<T>
) {
  return (props: Optionalize<T, WithPaymentProps>) => {
    const payment = useContext(PaymentContext);

    return <WrappedComponent {...(props as T)} paymentProps={payment} />;
  };
}
