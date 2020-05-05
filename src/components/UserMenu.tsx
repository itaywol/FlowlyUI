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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import { Balance } from "./Balance";
import { menuController } from "@ionic/core";

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
                                onClick={() => menuController.close()}
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
                                onClick={() => menuController.close()}
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
                                onClick={() =>{userReady.logout(); menuController.close();}}
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
                                onClick={() => menuController.close()}
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
            {props.user.type === "Ready" ? (
                <IonItem>
                    <IonLabel>
                        <div className="UserMenu__TitleContainer">
                            <div className="UserMenu__nickrow">
                                <span>{props.user.user !== null ? `Hi, ${props.user.user.nickName}` : "Hi there"}</span>
                                <Balance className="UserMenu__balance" />
                            </div>
                            {/* <div className="UserMenu__loginlogout">{props.user.user === null ?
                                <div>
                                    <span>Login</span>
                                    <IonIcon icon={logIn} />
                                </div> :
                                <div>
                                    <span>Logout</span>
                                    <IonIcon icon={logOut} />
                                </div>}
                            </div> */}
                        </div>
                        {renderMenuItems()}
                    </IonLabel>
                </IonItem>
            ) : null}
        </>
    );
};

export const UserMenu = withUser(UserMenuComponent);
