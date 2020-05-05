import { UserProviderState, withUser } from "../providers/UserProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins, faDollarSign } from "@fortawesome/free-solid-svg-icons";
import React from "react";
import { IonSpinner } from "@ionic/react";
import './Balance.css';

interface BalanceProps { 
    user: UserProviderState;
    fontSize?: number;
    color?: string;
    className?: string;
}
const BalanceComponent: React.FunctionComponent<BalanceProps> = ({ user, fontSize, color, className }) => {
    if (user.type === "Loading") {
        return (<IonSpinner />);
    } else if (user.type === "Ready") {
        return (user.user !== null ?
            <div className={"Balance_container " + className} style={{ color: color, fontSize: fontSize !== undefined ? fontSize : 13 }}>
                <span>
                    <span>{user.user.balance.chargedBalance}</span>
                    <FontAwesomeIcon style={{ marginLeft: 4 }} icon={faCoins} color="#FFDF00" />
                </span>
                {user.user.balance.earnedBalance !== 0 ?
                    <span style={{marginLeft: 6}}>
                        <span>{user.user.balance.earnedBalance}</span>
                        <FontAwesomeIcon style={{ marginLeft: 4 }} icon={faDollarSign} color="#388e3c" />
                    </span> : null}
            </div> : null);
    } else {
        return null;
    }
}

export const Balance = withUser(BalanceComponent);
