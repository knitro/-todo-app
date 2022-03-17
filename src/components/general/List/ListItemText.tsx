import React from 'react';
import { IonIcon, IonItem, IonLabel, IonText } from "@ionic/react";

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {
  icon      : string,
  lhsUpper  : string,
  lhsLower  : string,
  rhsUpper  : string,
  rhsLower  : string,
  clickFunction?  : () => void,
}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const ListItemText: React.FC<Props> = (props: Props) => {
  
  ////////////////////////
  /*Variables*/
  ////////////////////////

  //Constants
  const blankFunction : () => void = () => {}

  //Props
  const icon = props.icon
  const lhsUpper = props.lhsUpper
  const lhsLower = props.lhsLower
  const rhsUpper = props.rhsUpper
  const rhsLower = props.rhsLower
  const clickFunction = (props.clickFunction) ? props.clickFunction : blankFunction
  
  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <IonItem onClick={clickFunction}>
      <IonIcon icon={icon} size="large" color="primary" />
      &nbsp; &nbsp; &nbsp; {/*Spacing*/}
      <IonLabel>
        <IonText className="labelHeader">{lhsUpper}</IonText>
        <IonText className="rightAligned">{rhsUpper}</IonText>
        <br/>
        <IonText className="belowHeaderText">{lhsLower}</IonText>
        <IonText className="belowHeaderTextRightAligned">{rhsLower}</IonText>
      </IonLabel>
    </IonItem>
  );
};

export default ListItemText;