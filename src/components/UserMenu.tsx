import { logIn, logOut, key } from "ionicons/icons";
import { IonIcon, IonItem, IonLabel, IonSpinner } from "@ionic/react";
import React from "react";
import "./Menu.css";
import { UserProviderState, withUser } from "../providers/UserProvider";
import { assertNever } from "assert-never";
import "./UserMenu.css";

interface UserMenuProps {
  selectedPage: string;
  user: UserProviderState;
}

const UserMenuComponent: React.FunctionComponent<UserMenuProps> = (
  props: UserMenuProps
) => {
  switch (props.user.type) {
    case "Loading":
      return (
        <div className="UserMenu__loaderContainer">
          <IonSpinner />
        </div>
      );
    case "Ready":
      const userReady = props.user;

      if (props.user.user === null) {
        return (
          <>
            <IonItem
              className={props.selectedPage === "login" ? "selected" : ""}
              routerLink={"login"}
              routerDirection="none"
              lines="none"
              detail={false}
            >
              <IonIcon slot="start" icon={logIn} />
              <IonLabel>{"Login"}</IonLabel>
            </IonItem>
            <IonItem
              className={props.selectedPage === "register" ? "selected" : ""}
              routerLink={"register"}
              routerDirection="none"
              lines="none"
              detail={false}
            >
              <IonIcon slot="start" icon={key} />
              <IonLabel>{"Register"}</IonLabel>
            </IonItem>
          </>
        );
      } else {
        return (
          <>
            <IonItem
              onClick={() => userReady.logout()}
              routerDirection="none"
              lines="none"
              detail={false}
              button={true}
            >
              <IonIcon slot="start" icon={logOut} />
              <IonLabel>{"Logout"}</IonLabel>
            </IonItem>
            <IonItem
              className={props.selectedPage === "profile" ? "selected" : ""}
              routerLink={"profile"}
              routerDirection="none"
              lines="none"
              detail={false}
            >
              <IonIcon slot="start" icon={key} />
              <IonLabel>{"Profile"}</IonLabel>
            </IonItem>
          </>
        );
      }
    case "Failed":
      return <div>{"Error getting user"}</div>;
    default:
      assertNever(props.user);
  }
};

export const UserMenu = withUser(UserMenuComponent);
