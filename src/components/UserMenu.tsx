import { logIn, logOut, key } from "ionicons/icons";
import {
    IonIcon,
    IonItem,
    IonLabel,
    IonSpinner,
    IonAvatar,
} from "@ionic/react";
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
    const renderMenuItems = () => {
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
                                className={
                                    props.selectedPage === "login"
                                        ? "selected"
                                        : ""
                                }
                                routerLink={"login"}
                                routerDirection="none"
                                lines="none"
                                detail={false}
                            >
                                <IonIcon slot="start" icon={logIn} />
                                <IonLabel>{"Login"}</IonLabel>
                            </IonItem>
                            <IonItem
                                className={
                                    props.selectedPage === "register"
                                        ? "selected"
                                        : ""
                                }
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
                                className={
                                    props.selectedPage === "profile"
                                        ? "selected"
                                        : ""
                                }
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

    return (
        <>
            {props.user.type === "Ready" && props.user.user !== null ? (
                <IonItem>
                    <IonAvatar slot="end">
                        <img src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y" />
                    </IonAvatar>
                    <IonLabel>
                        <h3>{props.user.user?.nickName}</h3>
                        <p>
                            Current balance:{" "}
                            {props.user.user.balance.currentBalance}
                        </p>
                    </IonLabel>
                </IonItem>
            ) : null}
            {renderMenuItems()}
        </>
    );
};

export const UserMenu = withUser(UserMenuComponent);
