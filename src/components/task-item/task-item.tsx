import React, { useState } from 'react';
import { IonAlert, IonIcon, IonItemOption, IonItemOptions, IonItemSliding } from "@ionic/react";
import ListItem from '../general/List/ListItem';
import { Task } from '../../interfaces/tasks';
import { ellipseOutline, trashBin } from 'ionicons/icons';
import { deleteTask } from '../../firebase/firestore/firestore-tasks';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {
  task : Task
  loadingFunction : (b : boolean) => void
  alertFunction : (b : boolean) => void
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
  const task = props.task
  const header = task.name
  const notes = task.notes
  const loadingFunction = props.loadingFunction
  const alertFunction = props.alertFunction
  
  ////////////////////////
  /*Hooks*/
  ////////////////////////

  const [complete, setComplete] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const deleteFunction = () => {
    deleteTask(task, loadingFunction, alertFunction)
  }
  
  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <>
      <IonItemSliding>
        <IonItemOptions side="start">
          <IonItemOption color="danger" onClick={deleteFunction}>
            <IonIcon color="" icon={trashBin} size="large"/>
          </IonItemOption>
        </IonItemOptions>
        <ListItem icon={ellipseOutline} header={header} subheader={notes} largeText={false} clickFunction={clickFunction}/>
      </IonItemSliding>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass='failed'
        header={header}
        message={notes}
        buttons={["Close"]}
      />
    </>
  );
};

export default TaskItem;