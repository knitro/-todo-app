import React, { useState } from 'react';
import { IonAlert } from "@ionic/react";
import ListItem from '../general/List/ListItem';
import { Task } from '../../interfaces/tasks';
import { bluetooth } from 'ionicons/icons';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {
  task : Task
}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const TaskItem: React.FC<Props> = (props) => {
  
  ////////////////////////
  /*Variables*/
  ////////////////////////

  // Constants
  const clickFunction : () => void = () => setShowAlert(true)

  //Props
  const icon = bluetooth
  const header = "Header"
  const subheader = "Subheader"
  const largeText = false
  
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

export default TaskItem;