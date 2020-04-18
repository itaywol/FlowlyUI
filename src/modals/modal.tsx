import React, { PropsWithChildren, ReactPortal } from "react";
import { IonModal } from "@ionic/react";

const Modal: React.FC<
  PropsWithChildren<any> & {
    isOpen: boolean;
    setOpen: () => void;
  } & HTMLIonModalElement
> = ({ children, isOpen, setOpen, ...props }) => {
  return (
    <IonModal swipeToClose onDidDismiss={setOpen} isOpen={isOpen} {...props}>
      {children}
    </IonModal>
  );
};

export default Modal;
