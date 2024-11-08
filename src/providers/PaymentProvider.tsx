import React, {
    createContext,
    useContext,
    FC,
    useState,
    useEffect,
} from "react";
import socketIoClient from "socket.io-client";
import Axios, { AxiosResponse } from "axios";
import { Draft } from "immer";
import { Optionalize } from "../utils/Optionalize";
import { useImmerReducer, Reducer } from "use-immer";
import { UserContext } from "./UserProvider";

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
export interface PaymentProviderState {
    paymentToken: TokenResponse | null;
    paymentPlans: PaymentPlan[] | null;
    paymentNonce: string;
    selectedPaymentPlan: PaymentPlan | null;
    specifyPaymentAmount: number;
    checkoutUsingPaymentPlan: boolean;
    checkoutCalled: boolean;
    checkoutLoading: boolean;
    checkoutSuccess: boolean;
    transactionData: any | null;
}

export type paymentReducerActions =
    | { type: "getToken"; tokenResponse: TokenResponse | null }
    | { type: "getPaymentPlans"; plans: PaymentPlan[] | null }
    | { type: "checkout"; loading: boolean }
    | { type: "checkoutDone"; success: boolean; data?: any }
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
            draft.checkoutCalled = true;
            draft.checkoutLoading = action.loading;
            break;
        }
        case "checkoutDone": {
            if (action.data) {
                draft.checkoutLoading = false;
                draft.checkoutSuccess = action.success;
                draft.transactionData = action.data;
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
    checkoutCalled: false,
    checkoutLoading: false,
    checkoutSuccess: false,
    transactionData: null,
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
    const user = useContext(UserContext);
    const [state, dispatch] = useImmerReducer(
        paymentReducer,
        PaymentProviderInitialState
    );
    const [bInstance, setBInstance] = useState<any>(null);

    useEffect(() => {
        const socket = socketIoClient("/payment", { path: "/ws" });
        socket.on("PaymentStatus", (data: any) => {
            dispatch({
                type: "checkoutDone",
                success: data.success,
                data: data,
            });
        });
    }, []);

    const fetchToken = () => {
        Axios.post<TokenResponse | null>("/api/payment/token").then(
            (response: AxiosResponse<TokenResponse | null>) => {
                if (response && response.status < 300) {
                    dispatch({
                        type: "getToken",
                        tokenResponse: response.data,
                    });
                }
            }
        );
    };

    const setInstance = (instance: any) => {
        setBInstance(instance);
    };

    const checkout = () => {
        if (bInstance !== null) {
            bInstance.requestPaymentMethod().then((response: any) => {
                if (state.checkoutUsingPaymentPlan) {
                    dispatch({ type: "checkout", loading: true });
                    Axios.post("/api/payment/checkout", {
                        payment_method_nounce: response.nonce,
                        paymentPlanID: state?.selectedPaymentPlan?._id,
                    }).then(() => {
                        dispatch({ type: "checkoutDone", success: false });
                    });
                } else {
                    dispatch({ type: "checkout", loading: true });
                    Axios.post("/api/payment/checkout", {
                        payment_method_nounce: response.nonce,
                        paymentAmount: state.specifyPaymentAmount,
                    }).then(() => {
                        dispatch({ type: "checkoutDone", success: false });
                    });
                }
            });
        }
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
    payment: PaymentProviderProps;
}

export function withPayment<T extends WithPaymentProps = WithPaymentProps>(
    WrappedComponent: React.ComponentType<T>
) {
    return (props: Optionalize<T, WithPaymentProps>) => {
        const payment = useContext(PaymentContext);

        return <WrappedComponent {...(props as T)} payment={payment} />;
    };
}
