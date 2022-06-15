import React, { useState } from 'react';
import { IonAlert, IonButtons, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonContent, IonIcon, IonItem, IonItemOption, IonItemOptions, IonItemSliding, IonLabel, IonList, IonPopover, IonText, IonTitle, IonToolbar } from "@ionic/react";
import ListItem from '../general/List/ListItem';
import { Task } from '../../interfaces/tasks';
import { checkmarkCircle, ellipseOutline, ellipsisVertical, trashBin } from 'ionicons/icons';
import { deleteTask } from '../../firebase/firestore/firestore-tasks';
import "./task-item.css"
import { threadId } from 'worker_threads';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {
  id : string
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
  const id = props.id;
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

  // Options popover
  const [popoverOpen, setPopoverOpen] = useState(false);
  
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
  
  const optionsButtonPress = () => {
    setPopoverOpen(true)
  }

  const deleteFunction = () => {
    deleteTask(task, loadingFunction, alertFunction)
  }

  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <>
      <IonCard>

          <IonToolbar>

            <IonButtons slot="start">
              <div onClick={taskCompletionToggle}>
                <IonIcon icon={checkIcon} color="primary" size="large"/>
              </div>
            </IonButtons>

            {
              (!complete)
              ? <IonTitle class="task-item-title" onClick={clickFunction}>{header}</IonTitle>
              : <IonTitle class="task-item-title" onClick={clickFunction}><del>{header}</del></IonTitle>

            }

            <IonButtons slot="end">
              <div id={id + "-popover-button"} onClick={optionsButtonPress}>
                <IonIcon className="task-item-options-icon" icon={ellipsisVertical} color="primary"/>
              </div>
              <IonPopover reference="trigger" trigger={id + "-popover-button"} alignment="end" side="bottom">
                <IonList>
                  <IonItem button>Edit</IonItem>
                  <IonItem button>Delete</IonItem>
                </IonList>
            </IonPopover>
            </IonButtons>

          </IonToolbar>
          {
            (notes !== "")
            ? <IonCardContent>
                {
                  (!complete)
                  ? <IonText>{notes}</IonText>
                  : <IonText><i><del>{notes}</del></i></IonText>
                }
              </IonCardContent>
            : <></>
          }
      </IonCard>

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