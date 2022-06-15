import React, { useState } from 'react';
import { IonHeader, IonToolbar, IonTitle, IonButtons, IonBackButton, IonIcon, IonItem, IonMenuButton } from "@ionic/react";
import { logInOutline, personCircleOutline } from 'ionicons/icons';
import { auth } from '../../../firebase/firebase';
import { getUser } from '../../../firebase/auth/auth';
import { useHistory } from 'react-router';
import "./header.css"

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {
  headerLabel? : string
  isBackButton? : boolean
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

  // Constants
  const headerColour : string = "primary"

  // Props
  const headerLabel : string  = (props.headerLabel) ? props.headerLabel : ""
  const isBackButton : boolean = (props.isBackButton) ? props.isBackButton : false

  const history = useHistory();

  ////////////////////////
  /*Hooks*/
  ////////////////////////

  const [loggedIn, setLoggedIn] = useState(getUser() !== null)

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

  const ProfileButtonFunction = () => {
    console.log("Profile Button Pressed")
  }
  
  ////////////////////////
  /*Return*/
  ////////////////////////

  // <IonButtons slot="start">
  // {
  //   (isBackButton)
  //   ? <IonBackButton defaultHref="/tasks" />
  //   : <IonMenuButton autoHide={false}/>
  // }
  

  return (
    <>
      <div className="header-top-padding" />

      <IonToolbar className="header-transparent">
        <IonTitle className="header-title"><b>{headerLabel}</b></IonTitle>
        <IonButtons slot="end">
          {
            (loggedIn)
            ?
              <IonItem lines="none" className="header-transparent">
                <IonIcon icon={personCircleOutline} size="large" onClick={() => ProfileButtonFunction()}/>
              </IonItem>
            :  
              <IonItem lines="none" className="header-transparent">
                <IonIcon icon={logInOutline} size="large" onClick={() => history.push("/login")}/>
              </IonItem>
          }
        </IonButtons>
      </IonToolbar>
    </>
  );
};



export default Header;