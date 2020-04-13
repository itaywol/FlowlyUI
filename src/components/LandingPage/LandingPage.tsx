import { IonContent, IonSlides, IonSlide, IonButton } from "@ionic/react";
import React from "react";

const LandingPage: React.FC<{ continue: any }> = (props) => {
  return (
    <IonContent fullscreen class="ion-padding" scroll-y={false}>
      <IonSlides
        pager={true}
        options={{ initialSlide: 0, speed: 400 }}
        style={{ height: "100%" }}
      >
        <IonSlide>
          <div className="slide">
            <h2>Welcome</h2>
          </div>
        </IonSlide>
        <IonSlide>
          <h1>This is Performa</h1>
        </IonSlide>
        <IonSlide>
          <IonButton
            onClick={() => {
              localStorage.setItem("performaLanded", "true");
              props.continue(true);
            }}
          >
            Continue!
          </IonButton>
        </IonSlide>
      </IonSlides>
    </IonContent>
  );
};
export default LandingPage;
