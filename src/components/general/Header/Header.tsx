import React, { useState } from 'react';
import { IonToolbar, IonTitle, IonButtons, IonIcon, IonItem, IonPopover, IonList } from "@ionic/react";
import { logInOutline, personCircleOutline } from 'ionicons/icons';
import { auth } from '../../../firebase/firebase';
import { doSignOut, getUser } from '../../../firebase/auth/auth';
import { useHistory } from 'react-router';
import "./header.css"
import BackFab from '../../fabs/back-fab/back-fab';
import { v4 } from 'uuid';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {
  headerLabel? : string
  isBackButton? : boolean
  isProfile? : boolean
}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

/**
 * Displays the Custom Header Component.
 * It also will display over the header detailing when a new item has been added.
 * @param props - headerLabel => header string; isBack => back button instead of hamburger; noCart => do not display cart button
 */
const Header: React.FC<Props> = (props) => {
  
  ////////////////////////
  /*Variables*/
  ////////////////////////

  // Props
  const headerLabel : string  = (props.headerLabel) ? props.headerLabel : ""
  const isBackButton : boolean = (props.isBackButton) ? props.isBackButton : false
  const isProfile : boolean = (props.isProfile) ? props.isProfile : false

  const history = useHistory();
  const headerId : string = v4() + "header-profile-button"

  ////////////////////////
  /*Hooks*/
  ////////////////////////

  const [loggedIn, setLoggedIn] = useState(getUser() !== null)
  const [showPopover, setShowPopover] = useState(false);

  // Calls on Start Up and updates from the order size
  auth.onAuthStateChanged(function(user) {
    if (user) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  });

  ////////////////////////
  /*Functions*/
  ////////////////////////

  const loginButtonFunction = () => {
    history.push("/login")
  }

  const profileButtonFunction = () => {
    setShowPopover(true)
  }

  const settingsButtonFunction = () => {
    setShowPopover(false)
    history.push("settings")
  }

  const signOutButtonFunction = () => {
    setShowPopover(false)
    doSignOut()
    history.push("login")
  }
  
  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <>
      {
        (isBackButton)
        ? <BackFab />
        : <></>
      }
      <div className="header-top-padding" />

      <IonToolbar className="header-transparent">
        <IonTitle className="header-title"><b>{headerLabel}</b></IonTitle>
        <IonButtons slot="end">
          {
            (isProfile)
            ? <IonItem lines="none" className="header-transparent" id={headerId}>
              {
                (loggedIn)
                ? <IonIcon icon={personCircleOutline} size="large" onClick={() => profileButtonFunction()}/>
                : <IonIcon icon={logInOutline} size="large" onClick={loginButtonFunction}/>
              }
              </IonItem>
            : <></>
          }
          <IonPopover reference="trigger" trigger={headerId} alignment="end" side="bottom" isOpen={showPopover} onDidDismiss={() => setShowPopover(false)}>
            <IonList>
              <IonItem button onClick={settingsButtonFunction}>Settings</IonItem>
              <IonItem button onClick={signOutButtonFunction}>Sign Out</IonItem>            
            </IonList>
          </IonPopover>
        </IonButtons>
      </IonToolbar>
    </>
  );
};



export default Header;