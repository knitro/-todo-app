import { IonFab, IonFabButton, IonIcon } from '@ionic/react';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

export interface Props {
  vertical    : "center" | "top" | "bottom",
  horizontal  : "center" | "start" | "end",
  icon?       : string,
  action      : () => void,
  color       : string,
  iconSize?   : "small" | undefined
};

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const FloatingActionButton = (props : Props) => {

  ////////////////////////
  /*Variables*/
  ////////////////////////

  //Props
  const vertical = props.vertical;
  const horizontal = props.horizontal;
  const icon = props.icon;
  const action = props.action;
  const color = props.color;
  const iconSize = (props.iconSize) ? props.iconSize : undefined

  ////////////////////////
  /*Return*/
  ////////////////////////
  
  return (
    <IonFab vertical={vertical} horizontal={horizontal} slot="fixed">
      <IonFabButton onClick={action} color={color} size={iconSize}>
        <IonIcon icon={icon} size={iconSize}/>
      </IonFabButton>
    </IonFab>
  );
}

export default FloatingActionButton;