import React, { useEffect, useState } from "react";

type authenticationValidationHook = () => boolean;
const useAuthenticationValidation: authenticationValidationHook = () => {
  const [isAuthenticated, setAuthenticated] = useState<boolean | undefined>(
    false
  );

  return isAuthenticated ? isAuthenticated : false;
};

export default useAuthenticationValidation;
