import React, { FC, useState, useRef, RefObject } from "react";
import { IonContent, IonButton, IonPage } from "@ionic/react";
import { LoginModal } from "../LoginModal/LoginModal";
import Modal from "../../modals/modal";
import { RegisterModal } from "../RegisterModal/RegisterModal";
import { useUserContext } from "../../providers/user/UserProvider";

export const AuthenticationPage: FC = () => {
  const pageRef = useRef<
    | ((instance: HTMLIonContentElement | null) => void)
    | RefObject<HTMLIonContentElement>
    | null
    | undefined
  >();
  const [loginModalState, setLoginModal] = useState<boolean>(false);
  const [registerModalState, setRegisterModal] = useState<boolean>(false);
  return (
    <IonContent fullscreen class="ion-padding" ref={pageRef.current}>
      <IonButton onClick={(e) => setLoginModal(!loginModalState)}>
        Login
      </IonButton>
      <IonButton onClick={(e) => setRegisterModal(!registerModalState)}>
        Register
      </IonButton>
      <Modal
        isOpen={loginModalState}
        setOpen={() => setLoginModal(false)}
        presentingElement={pageRef}
      >
        <LoginModal />
      </Modal>
      <Modal
        isOpen={registerModalState}
        setOpen={() => setRegisterModal(false)}
        presentingElement={pageRef}
      >
        <RegisterModal />
      </Modal>
    </IonContent>
  );
};
