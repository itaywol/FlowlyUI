import React, { useState, useEffect } from "react";
import axios, { AxiosRequestConfig, AxiosResponse, AxiosError } from "axios";
axios.defaults.withCredentials = true;

export interface IUseFetch {
  response: any;
  loading: boolean;
  error: boolean;
}

type useFetchHook<T> = [
  React.Dispatch<React.SetStateAction<AxiosRequestConfig | undefined>>,
  {
    response: AxiosResponse<T> | AxiosError<T> | undefined;
    loading: boolean;
    error: boolean;
    called: boolean;
  }
];
export function useFetch<T>(): useFetchHook<T> {
  const [response, setResponse] = useState<AxiosResponse<T> | AxiosError<T>>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  const [called, setCalled] = useState<boolean>(false);
  const [axiosRequest, setAxiosRequest] = useState<AxiosRequestConfig>();

  useEffect(() => {
    let mounted = true;
    const abortController = new AbortController();
    const signal = abortController.signal;
    setCalled(false);
    if (axiosRequest && mounted) {
      setCalled(true);
      const fetchData = async () => {
        try {
          setLoading(true);
          const response = await axios(axiosRequest);
          if (response.status === 200 && !signal.aborted) {
            setResponse(response.data);
          }
        } catch (err) {
          if (!signal.aborted) {
            setResponse(err);
            setError(true);
          }
        } finally {
          if (!signal.aborted) {
            setLoading(false);
          }
        }
      };
      fetchData();
    }

    return () => {
      mounted = false;
      setCalled(false);
      abortController.abort();
    };
  }, [axiosRequest]);

  return [setAxiosRequest, { response, loading, error, called }];
}
export default useFetch;
