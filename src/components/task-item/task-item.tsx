import React, { useState } from 'react';
import { IonAlert, IonCard, IonCardHeader, IonCardTitle, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonText } from "@ionic/react";
import ListItem from '../general/List/ListItem';
import { Task } from '../../interfaces/tasks';
import { checkmarkCircle, ellipseOutline, trashBin } from 'ionicons/icons';
import { deleteTask } from '../../firebase/firestore/firestore-tasks';
import "./task-item.css"

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

  
  const [showAlert, setShowAlert] = useState(false);

  // Completion of Task Changes
  const [complete, setComplete] = useState(false);
  const [checkIcon, setCheckIcon] = useState(ellipseOutline)
  
  ////////////////////////
  /*Functions*/
  ////////////////////////

  const taskCompletionToggle = () => {
    if (complete) {
      setComplete(false)
      setCheckIcon(ellipseOutline)
    } else {
      setComplete(true)
      setCheckIcon(checkmarkCircle)
    }
  }

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

        <IonItem>
          {
            <div onClick={taskCompletionToggle}>
              <IonIcon icon={checkIcon} color="primary" size="large"/>
              &nbsp; &nbsp; &nbsp; {/*Spacing*/}
            </div>
          }
          <IonLabel onClick={clickFunction}>

            {
              (!complete)
              ? <>
                  <IonText><b>{header}</b></IonText>
                  <br/>
                  <IonText>{notes}</IonText>
                </>
              : <>
                  <IonText><i><del>{header}</del></i></IonText>
                  <br/>
                  <IonText><i><del>{notes}</del></i></IonText>
                </>
            }
          </IonLabel>
        </IonItem>
      </IonItemSliding>
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass='failed'
        header={header}
        message={
          notes !== "" ? notes : "No additional information provided"
        }
        buttons={["Close"]}
      />
    </>
  );
};

export default TaskItem;