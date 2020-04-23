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
  IonCardSubtitle,
} from "@ionic/react";
import { useImmer } from "use-immer";
import React, { useEffect } from "react";
import "./Payment.scss";
import { UserProviderState, withUser } from "../../providers/UserProvider";
import assertNever from "assert-never";
import { useBraintree } from "../../hooks/useBraintree";
import DropIn from "braintree-web-drop-in-react";
import Axios from "axios";

interface ProfileProps {
  user: UserProviderState;
}
//const TestPaymentPage = () => {
//const [nounce, setNounce] = useState();
//const [getToken, { token }] = useBraintree();
//const [braintreeInstance, setInstance] = useState();
//const [login] = useFetch();
//const [buy] = useFetch();

//function doPayment() {
//if (braintreeInstance) {
//braintreeInstance
//?.requestPaymentMethod()
//.then((response: any) => setNounce(response.nonce));
//}
//}

//useEffect(() => {
//if (!token) getToken();
//if (nounce) {
//buy({
//url: "/api/payment/checkout",
//method: "post",
//data: { payment_method_nounce: nounce, paymentAmount: 10 },
//});
//}
//}, [token, nounce]);

//return (
//<>
//{token && (
//<div>
//<DropIn
//options={{
//authorization: token,
//paypal: { flow: "checkout", amount: "10.0", currency: "USD" },
//}}
//onInstance={(instance) => setInstance(instance)}
///>
//<IonButton onClick={doPayment}>Submit Payment</IonButton>
//</div>
//)}
//</>
//);
//};

const PaymentPageContent: React.FunctionComponent<ProfileProps> = (
  props: ProfileProps
) => {
  const [getToken, respToken] = useBraintree();
  const [state, setState] = useImmer<{
    nonce: string | undefined;
    token: string | undefined;
    instance: any | undefined;
  }>({ instance: undefined, nonce: undefined, token: undefined });

  function doPayment() {
    if (state.instance) {
      state.instance?.requestPaymentMethod().then((response: any) =>
        setState((draft) => {
          draft.nonce = response.nonce;
        })
      );
    }
  }

  function updateInstance(instance: any) {
    setState((draft) => {
      draft.instance = instance;
    });
  }

  useEffect(() => {
    if (!state.token) getToken();
    if (respToken.token) setState((draft) => (draft.token = respToken.token));
    if (state.nonce) {
      Axios.post("/api/payment/checkout", {
        payment_method_nounce: state.nonce,
        paymentAmount: 10,
      });
    }
  }, [state.token, state.nonce, respToken]);

  if (props.user.type === "Loading" || props.user.type === "Failed")
    return <></>;

  return (
    <>
      {props.user.user && (
        <IonCard>
          <IonCardHeader>
            <IonTitle>Hello {props.user.user?.nickName}</IonTitle>
            <IonCardSubtitle>
              eBalance: {props.user.user?.balance.currentBalance}
            </IonCardSubtitle>
          </IonCardHeader>
          <IonCardContent>
            {state.token[1].token && (
              <div>
                <DropIn
                  options={{
                    authorization: state.token[1].token,
                    paypal: {
                      flow: "checkout",
                      amount: "10.0",
                      currency: "USD",
                    },
                  }}
                  onInstance={(instance: any) => updateInstance(instance)}
                />
                <IonButton onClick={doPayment}>Submit Payment</IonButton>
              </div>
            )}
          </IonCardContent>
        </IonCard>
      )}
    </>
  );
};

const PaymentPageComponent: React.FunctionComponent<ProfileProps> = (
  props: ProfileProps
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

          <IonContent fullscreen class="ion-padding">
            <PaymentPageContent {...props} />
          </IonContent>
        </IonPage>
      );
    case "Failed":
      return <div>Error getting user</div>;
    default:
      assertNever(props.user);
  }
};

export const PaymentPage = withUser(PaymentPageComponent);
