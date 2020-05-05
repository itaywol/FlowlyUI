import { withUser, UserProviderState } from "../providers/UserProvider";
import { logoGoogle, logoFacebook } from "ionicons/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFacebook } from "@fortawesome/free-brands-svg-icons"
import FacebookLogin, { ReactFacebookLoginInfo } from "react-facebook-login";
import React, { useState } from "react";
import GoogleLogin, { GoogleLoginResponse, GoogleLoginResponseOffline } from "react-google-login";
import { IonButton, IonIcon, IonAlert } from "@ionic/react";
import { RouteComponentProps, withRouter } from "react-router";
import "./SocialAuth.css";

interface SocialAuthProps extends RouteComponentProps {
    user: UserProviderState;
}

interface LoginState {
    email: string;
    password: string;
}

const SocialAuthComponent: React.FunctionComponent<SocialAuthProps> = ({ user, history }) => {
    const [showAlert, setShowAlert] = useState<string | false>(false);
    
    const onFacebookSubmit = async (result: ReactFacebookLoginInfo) => {
        if (user.type === "Ready") {
            try {
                await user.facebookLogin(result.accessToken);
                history.push("/home");
            } catch (e) {
                if (e.response.data.message !== undefined) {
                    setShowAlert(e.response.data.message);
                } else {
                    setShowAlert("Login failed");
                }
            }
        } else {
            setShowAlert("Login failed");
        }
    };

    const onGoogleSubmit = async (
        result: GoogleLoginResponse | GoogleLoginResponseOffline
    ) => {
        if ((result as any).code === undefined && user.type === "Ready") {
            try {
                await user.googleLogin(
                    (result as GoogleLoginResponse).accessToken
                );
                history.push("/home");
            } catch (e) {
                if (e.response.data.message !== undefined) {
                    setShowAlert(e.response.data.message);
                } else {
                    setShowAlert("Login failed");
                }
            }
        } else {
            setShowAlert("Login failed");
        }
    };

    return (
        <>
            <IonAlert
                isOpen={showAlert !== false}
                onDidDismiss={() => setShowAlert(false)}
                header={"Error"}
                message={showAlert !== false ? showAlert : ""}
                buttons={["Ok"]}
            />
            <div className="SocialAuth__or">
                or
            </div>
            <div className="SocialAuth__socialContainer">
                <FacebookLogin
                    appId="662636214298507"
                    fields="name,email,picture"
                    callback={onFacebookSubmit}
                    disableMobileRedirect={true}
                    icon={<FontAwesomeIcon icon={faFacebook} size="2x" />}
                    cssClass="SocialAuth__facebook"
                    textButton=""
                />
                <GoogleLogin
                    clientId="1014596992798-h2tr5h1lts32p6ld93qtpvc0b17c88p6.apps.googleusercontent.com"
                    buttonText="Login"
                    onSuccess={onGoogleSubmit}
                    render={(props) => <IonButton shape="round" color="light" className="SocialAuth__google" onClick={props.onClick} disabled={props.disabled}>
                        <IonIcon slot="icon-only" src="/assets/google-logo.svg" />
                    </IonButton>}
                    onFailure={(result) => {
                        setShowAlert("Login failed");
                        console.error(result);
                    }}
                />
            </div>
        </>
    );
}

export const SocialAuth = withRouter(withUser(SocialAuthComponent));