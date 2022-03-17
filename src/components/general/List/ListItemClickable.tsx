import React, { useState } from 'react';
import { IonAlert } from "@ionic/react";
import ListItem from './ListItem';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {
  icon?           : string,
  header          : string,
  subheader?      : string,
  largeText?      : boolean
}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

/**
 * Creates a Item that is placed in an IonList
 * Note that if any of the options are being used, it will display one of the following in this order {Options, OptionsMulti, OptionsSlider}
 * @param props 
 * @returns 
 */
const ListItemClickable: React.FC<Props> = (props) => {
  
  ////////////////////////
  /*Variables*/
  ////////////////////////

  // Constants
  const clickFunction : () => void = () => setShowAlert(true)

  //Props
  const icon = props.icon
  const header = props.header
  const subheader = props.subheader
  const largeText = (props.largeText) ? props.largeText : false
  
  ////////////////////////
  /*Hooks*/
  ////////////////////////

  const [showAlert, setShowAlert] = useState(false);
  
  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <>
      <ListItem icon={icon} header={header} subheader={subheader} largeText={largeText} clickFunction={clickFunction}/>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass='failed'
        header={header}
        // subHeader={subheader}
        message={subheader}
        buttons={["Dismiss"]}
      />
    </>
  );
};

export default ListItemClickable;