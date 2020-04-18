import React, { useState, useEffect } from "react";
import { client } from "braintree-web";
import useFetch from "./useFetch";

export const useBraintree: () => [() => void, { token: string }] = () => {
  const [token, setToken] = useState();
  const [getToken, { response, loading, error, called }] = useFetch<{
    success: string;
    clientToken: string;
  }>();
  useEffect(() => {}, []);

  useEffect(() => {
    if (response && called && !error) {
      setToken(response.clientToken);
    }
  }, [response, error, called]);

  const fetchToken = () =>
    getToken({ url: "/api/payment/token", method: "post" });

  return [fetchToken, { token }];
};
