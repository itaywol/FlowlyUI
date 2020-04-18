import React, { useState } from "react";
import { client } from "braintree-web";
import useFetch from "./useFetch";

export const useBraintree = () => {
  const [token, setToken] = useState<string | undefined>();

  return [fetchToken];
};
