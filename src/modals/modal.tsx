import React, { PropsWithChildren } from "react";
import { IonModal } from "@ionic/react";

const Modal: React.FC<PropsWithChildren<Element> & { isOpen: boolean }> = ({
  children,
  isOpen,
}) => {
  return <IonModal isOpen={isOpen}>{children}</IonModal>;
};

export default Modal;
