import React from 'react';
import { IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {
  icon?     : string,
  lhsText   : string,
  rhsText?  : string,
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
const ListItemSmall: React.FC<Props> = (props) => {
  
  ////////////////////////
  /*Variables*/
  ////////////////////////

  //Props
  const icon = props.icon
  const lhsText = props.lhsText
  const rhsText = props.rhsText
  
  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <IonItem>
      {
        (icon)
        ? <IonIcon icon={icon} color="primary" slot="start"/>
        : <></>
      }
      <IonLabel className="ion-text-wrap">
        <IonText>{lhsText}</IonText>
      </IonLabel>

      {
        (rhsText)
        ? <IonLabel className="rightAligned">
            <IonText>{rhsText}</IonText>
          </IonLabel>
        : <></>
      }
    </IonItem>
  );
};

export default ListItemSmall;