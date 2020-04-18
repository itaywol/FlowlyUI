import React, { useEffect, useState } from "react";
import "./ExploreContainer.css";
import { useBraintree } from "../hooks/useBraintree";
import useFetch from "../hooks/useFetch";
import DropIn from "braintree-web-drop-in-react";
import { IonButton } from "@ionic/react";

interface ContainerProps {
  name: string;
}

interface ContainerContent {
  title: string;
  url: string;
  Content: React.FC | undefined;
}

const TestPaymentPage = () => {
  const [nounce, setNounce] = useState();
  const [getToken, { token }] = useBraintree();
  const [braintreeInstance, setInstance] = useState();
  const [login] = useFetch();
  const [buy] = useFetch();

  function doPayment() {
    if (braintreeInstance) {
      braintreeInstance
        ?.requestPaymentMethod()
        .then((response: any) => setNounce(response.nonce));
    }
  }

  useEffect(() => {
    if (!token) getToken();
    if (nounce) {
      buy({
        url: "/api/payment/checkout",
        method: "post",
        data: { payment_method_nounce: nounce, paymentAmount: 10 },
      });
    }
  }, [token, nounce]);

  return (
    <>
      {token && (
        <div>
          <DropIn
            options={{
              authorization: token,
              paypal: { flow: "checkout", amount: "10.0", currency: "USD" },
            }}
            onInstance={(instance) => setInstance(instance)}
          />
          <IonButton onClick={doPayment}>Submit Payment</IonButton>
        </div>
      )}
    </>
  );
};

const ExploreContainer: React.FC<ContainerProps> = ({ name }) => {
  const containerContents: ContainerContent[] = [
    {
      title: "Home",
      url: "/home",
      Content: () => <>Home</>,
    },
    {
      title: "Explore",
      url: "/explore",
      Content: () => <>Explore</>,
    },
    {
      title: "Channel",
      url: "/channel",
      Content: () => <>Channel</>,
    },
  ];

  return (
    <div className="container">
      {containerContents
        .filter(({ title }) => title.toLowerCase() === name.toLowerCase())
        .map(({ Content }, index) => {
          if (Content) return <Content key={index} />;
        })}
    </div>
  );
};

export default ExploreContainer;
