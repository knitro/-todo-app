import React, { useState } from 'react';
import { IonAlert, IonButtons, IonCard, IonCardContent, IonChip, IonIcon, IonItem, IonLabel, IonList, IonPopover, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { Task } from '../../interfaces/tasks';
import { checkmarkCircle, ellipseOutline, ellipsisVertical } from 'ionicons/icons';
import { deleteTask } from '../../firebase/firestore/firestore-tasks';
import "./task-item.css"

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
  const categories = (task.categories) ? task.categories : []
  const loadingFunction = props.loadingFunction
  const alertFunction = props.alertFunction
  
  ////////////////////////
  /*Hooks*/
  ////////////////////////

  const [showAlert, setShowAlert] = useState(false);

  // Completion of Task Changes
  const [complete, setComplete] = useState(false);
  const [checkIcon, setCheckIcon] = useState(ellipseOutline)

  const [showPopover, setShowPopover] = useState(false);

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
    setShowPopover(false)
  }

  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <>
      <IonCard className="task-item-card">

          <IonToolbar class="task-item-toolbar">

            <IonButtons slot="start">
              <div onClick={taskCompletionToggle}>
                <IonIcon className="task-item-checkcircle" icon={checkIcon} color="primary"/>
              </div>
            </IonButtons>

            {
              (!complete)
              ? <IonTitle class="task-item-title" onClick={clickFunction}>{header}</IonTitle>
              : <IonTitle class="task-item-title" onClick={clickFunction}><del>{header}</del></IonTitle>

            }

            <IonButtons slot="end">
              <div id={id + "-popover-button"}>
                <IonIcon className="task-item-options-icon" icon={ellipsisVertical} color="primary" onClick={() => setShowPopover(true)}/>
              </div>
              <IonPopover reference="trigger" trigger={id + "-popover-button"} alignment="end" side="bottom" isOpen={showPopover} onDidDismiss={() => setShowPopover(false)}>
                <IonList>
                  <IonItem button onClick={() => setShowPopover(false)}>Edit</IonItem>
                  <IonItem button onClick={deleteFunction}>Delete</IonItem>
                </IonList>
            </IonPopover>
            </IonButtons>

          </IonToolbar>

          {
            ((notes !== "") || categories.length > 0)
            ? <IonCardContent className="task-item-content">
                {
                  (notes !== "")
                  ? <>
                      {
                        (!complete)
                        ? <IonText>{notes}</IonText>
                        : <IonText><i><del>{notes}</del></i></IonText>
                      }
                      <br/>
                    </>
                  : <></>
                }
                {
                  categories.map((current : string) => {
                    return (
                      <IonChip>
                        <IonLabel color="secondary">{current}</IonLabel>
                      </IonChip>
                    )
                  })
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