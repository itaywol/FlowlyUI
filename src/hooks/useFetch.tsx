import React, { useState } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
axios.defaults.withCredentials = true;

interface fetchResponse {
  data: AxiosResponse | undefined;
  loading: boolean;
  error: AxiosError | undefined;
  called: boolean;
}

interface baseParams {
  url: string;
  options: AxiosRequestConfig;
}

type fetchHook = () => [(arg0: baseParams) => Promise<void>, fetchResponse];

const useFetch: fetchHook = () => {
  const [called, setCalled] = useState<boolean>(false);
  const [data, setData] = useState<AxiosResponse>();
  const [error, setError] = useState<AxiosError>();
  const [loading, setLoading] = useState<boolean>(false);
  const invoke = async (arg0: baseParams) => {
    const { url, options } = arg0;
    setCalled(true);
    setLoading(true);
    axios(url, options)
      .then((response) => setData(response))
      .catch((error) => setData(error));
    setLoading(false);
  };

  const hookResponse: fetchResponse = { data, loading, error, called };
  return [invoke, hookResponse];
};

export default useFetch;
