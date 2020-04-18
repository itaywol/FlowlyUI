import React, { FC, useEffect } from "react";
import { IonContent } from "@ionic/react";
import useFetch from "../../hooks/useFetch";
import { useUserContext } from "../../providers/user/UserProvider";
export const LoginModal: FC = () => {
  const [goFetch, { response, loading, error, called }] = useFetch();
  return (
    <IonContent
      fullscreen
      onClick={(e) =>
        goFetch({
          url: "/api/auth/login",
          method: "post",
          data: { email: "wo.itay1212@gmail.com", password: "itaywol337" },
        })
      }
    >
      Login Modal
    </IonContent>
  );
};
