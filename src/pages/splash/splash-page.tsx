
import React from "react"
import { StyledFirebaseAuth } from "react-firebaseui";
import "./splash-page.css"
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { firebaseConfig } from "../../apikeys/apikeys";
import { useHistory } from "react-router";
import { auth } from "../../firebase/firebase";
import { IonCol, IonContent, IonGrid, IonImg, IonPage, IonRow } from "@ionic/react";

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props {}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const SplashPage : React.FC<Props> = () => {

  ////////////////////////
  // Variables
  ////////////////////////

  // Redirect if already logged in
  let history = useHistory()
  
  auth.onAuthStateChanged(function(user) {
    if (user) {
      history.push("tasks")
    }
  });

  /*
   * The current implementation does NOT support Firebase WebV9 and must use the compat layer.
   * This means that the re-initialisation is required for the time being until full support for V9 is done.
   * This also means that the space savings from V9 will not be present until AFTER full V9 support.
   */
  firebase.initializeApp(firebaseConfig);

  // Firebase Login UI Config
  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: 'popup',
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: '/tasks',
    // We will display Google and Facebook as auth providers.
    signInOptions: [
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    ],
  };

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <IonPage className="splash-page-ion-page">
      <IonContent className="splash-page-background">

        <IonGrid>
          <IonRow>
            <IonCol>
              <div className="splash-page-header-div">
                <IonImg src="/assets/logo-full.png"/>
              </div>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} className="splash-page-background" />
            </IonCol>
          </IonRow>
        </IonGrid>
        
        
        <div className="splash-page-login-buttons">
          
        </div>
        
      </IonContent>
    </IonPage>
  );
}

export default SplashPage;