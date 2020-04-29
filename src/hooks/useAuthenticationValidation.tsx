import { useEffect, useState } from "react";
import useFetch from "./useFetch";

type authenticationValidationHook = () => boolean;
const useAuthenticationValidation: authenticationValidationHook = () => {
  //const [checkAuthentication, authenticationData] = useFetch();
  const [isAuthenticated, setAuthenticated] = useState<boolean | undefined>(
    false
  );

  //useEffect(() => {
  //if (authenticationData?.called === false)
  //checkAuthentication({
  //url: "/api/auth/validate",
  //options: { method: "post" },
  //});

  //if (authenticationData.called && authenticationData.data)
  //setAuthenticated(authenticationData.data.data);
  //}, []);

  return isAuthenticated ? isAuthenticated : false;
};

export default useAuthenticationValidation;
