import React, {
  createContext,
  Component,
  useContext,
  FC,
  useState,
  useEffect,
} from "react";
import Axios, { AxiosResponse } from "axios";
import { Draft } from "immer";
import { Optionalize } from "../utils/Optionalize";
import { useImmerReducer, Reducer, useImmer } from "use-immer";

export interface TokenResponse {
  clientToken: string;
  success: boolean;
}

export interface PaymentPlan {
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
    paymentToken: TokenResponse | null;
    paymentPlans: PaymentPlan[] | null;
  }
  interface Ready {
    type: "Ready";
    paymentToken: TokenResponse | null;
    paymentPlans: PaymentPlan[] | null;
    paymentNonce: string;
    selectedPaymentPlan: PaymentPlan | null;
    specifyPaymentAmount: number;
    checkoutUsingPaymentPlan: boolean;
  }
  interface Failed {
    type: "Failed";
    error: any;
  }
}
export interface PaymentProviderState {
  paymentToken: TokenResponse | null;
  paymentPlans: PaymentPlan[] | null;
  paymentNonce: string;
  selectedPaymentPlan: PaymentPlan | null;
  specifyPaymentAmount: number;
  checkoutUsingPaymentPlan: boolean;
}

export type paymentReducerActions =
  | { type: "getToken"; tokenResponse: TokenResponse | null }
  | { type: "getPaymentPlans"; plans: PaymentPlan[] | null }
  | { type: "checkout"; nonce: string }
  | { type: "useFreeAmount"; amount: number }
  | { type: "usePlan"; plan: PaymentPlan };

const paymentReducer: Reducer<PaymentProviderState, paymentReducerActions> = (
  draft: Draft<PaymentProviderState>,
  action: paymentReducerActions
): void | PaymentProviderState => {
  switch (action.type) {
    case "getToken": {
      draft.paymentToken = action.tokenResponse;
      break;
    }
    case "getPaymentPlans": {
      draft.paymentPlans = action.plans;
      break;
    }
    case "usePlan": {
      draft.selectedPaymentPlan = action.plan;
      draft.checkoutUsingPaymentPlan = true;
      break;
    }
    case "useFreeAmount": {
      draft.specifyPaymentAmount = action.amount;
      draft.checkoutUsingPaymentPlan = false;
      break;
    }
    case "checkout": {
      if (action.nonce) {
        if (draft.checkoutUsingPaymentPlan) {
          Axios.post("/api/payment/checkout", {
            payment_method_nounce: action.nonce,
            paymentPlanID: draft?.selectedPaymentPlan?._id,
          });
        } else {
          Axios.post("/api/payment/checkout", {
            payment_method_nounce: action.nonce,
            paymentAmount: draft.specifyPaymentAmount,
          });
        }
      }

      break;
    }
  }
};
export interface PaymentProviderProps {
  state: PaymentProviderState;
  dispatch: React.Dispatch<paymentReducerActions> | undefined;
  fetchToken: (() => void) | null;
  fetchPaymentPlans: (() => void) | null;
  checkout: (() => void) | null;
  setInstance: ((instance: any) => void) | null;
}
const PaymentProviderInitialState: PaymentProviderState = {
  paymentPlans: null,
  paymentToken: null,
  paymentNonce: "",
  checkoutUsingPaymentPlan: false,
  specifyPaymentAmount: 0,
  selectedPaymentPlan: null,
};

export const PaymentContext = createContext<PaymentProviderProps>({
  state: PaymentProviderInitialState,
  fetchToken: null,
  fetchPaymentPlans: null,
  setInstance: null,
  checkout: null,
  dispatch: undefined,
});

export const PaymentProvider: FC = ({ children }) => {
  const [state, dispatch] = useImmerReducer(
    paymentReducer,
    PaymentProviderInitialState
  );
  const [bInstance, setBInstance] = useState<any>(null);

  const fetchToken = () => {
    Axios.post<TokenResponse | null>("/api/payment/token").then(
      (response: AxiosResponse<TokenResponse | null>) => {
        dispatch({ type: "getToken", tokenResponse: response.data });
      }
    );
  };

  const setInstance = (instance: any) => {
    setBInstance(instance);
  };

  const checkout = () => {
    if (bInstance !== null)
      bInstance.requestPaymentMethod().then((response: any) => {
        dispatch({ type: "checkout", nonce: response.nonce });
      });
  };
  const fetchPaymentPlans = () => {
    Axios.get<PaymentPlan[] | null>("/api/payment/plan")
      .then((response: AxiosResponse<PaymentPlan[] | null>) => {
        dispatch({ type: "getPaymentPlans", plans: response.data });
      })
      .catch((error: any) => {
        throw error;
      });
  };
  return (
    <PaymentContext.Provider
      value={{
        state,
        dispatch,
        fetchToken,
        setInstance,
        checkout,
        fetchPaymentPlans,
      }}
    >
      {children}
    </PaymentContext.Provider>
  );
};

export interface WithPaymentProps {
  paymentProps: PaymentProviderProps;
}

export function withPayment<T extends WithPaymentProps = WithPaymentProps>(
  WrappedComponent: React.ComponentType<T>
) {
  return (props: Optionalize<T, WithPaymentProps>) => {
    const payment = useContext(PaymentContext);

    return <WrappedComponent {...(props as T)} paymentProps={payment} />;
  };
}
