import React from 'react';
import LoginButtonsFirebaseUI from './login-buttons-firebaseui';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

/**
 * Determines which LoginButtons to use
 * @param props 
 * @returns 
 */
const LoginButtons: React.FC<Props> = (props : Props) => {

  return (
    <LoginButtonsFirebaseUI/>
  );
  
};

export default LoginButtons;