import React from 'react';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { StyledFirebaseAuth } from 'react-firebaseui';
import { firebaseConfig } from '../../apikeys/apikeys';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

/**
 * The Login Buttons from FirebaseUI.
 * NOTE: This uses https://github.com/firebase/firebaseui-web.
 * The current implementation does NOT support Firebase WebV9 and must use the compat layer.
 * This means that the re-initialisation is required for the time being until full support for V9 is done.
 * This also means that the space savings from V9 will not be present until AFTER full V9 support.
 * @param props 
 * @returns 
 */
const LoginButtonsFirebaseUI: React.FC<Props> = (props : Props) => {

  ////////////////////////
  // Variables
  ////////////////////////

  firebase.initializeApp(firebaseConfig);

  // Constants
  const url = "https://knitro-todo.web.app/"

  ////////////////////////
  // Config
  ////////////////////////

  const uiConfig = {
    signInFlow: 'popup',
    signInSuccessUrl: '/tasks',
    signInOptions: [              
      {
        provider: firebase.auth.EmailAuthProvider.PROVIDER_ID,
        signInMethod: firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD,
        emailLinkSignIn: function() {
          return {
            url: url,
          };
        }
      },
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      "apple.com"
    ],
  };

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
  );
};

export default LoginButtonsFirebaseUI;