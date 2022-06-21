import React, { useState } from 'react';
import { IonAccordion, IonAlert, IonButtons, IonCard, IonCardContent, IonChip, IonIcon, IonItem, IonLabel, IonList, IonPopover, IonText, IonTitle, IonToolbar } from "@ionic/react";
import { Task } from '../../interfaces/tasks';
import { checkmarkCircle, chevronDown, ellipseOutline, ellipsisVertical, remove } from 'ionicons/icons';
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
        <IonAccordion value={id}>
          <IonItem className="task-item-header" slot="header" detail={false} lines="none">
            
            <div onClick={taskCompletionToggle}>
              <IonIcon className="task-item-checkcircle" icon={checkIcon} color="primary"/>
            </div>

            <IonLabel className="task-item-header-text">{header}</IonLabel>
            
            <div id={id + "-popover-button"}>
              <IonIcon className="task-item-options-icon" icon={ellipsisVertical} color="primary" onClick={() => setShowPopover(true)}/>
            </div>
            <IonPopover reference="trigger" trigger={id + "-popover-button"} alignment="end" side="bottom" isOpen={showPopover} onDidDismiss={() => setShowPopover(false)}>
              <IonList>
                <IonItem button onClick={() => setShowPopover(false)}>Edit</IonItem>
                <IonItem button onClick={deleteFunction}>Delete</IonItem>
              </IonList>
            </IonPopover>
          </IonItem>
          
          <IonCardContent slot="content">
            <IonText><b>{header}</b></IonText>
            <br/>
            {
              (notes === "")
              ? <IonText><i>No notes provided</i></IonText>
              : <IonText>{notes}</IonText>
            }
            
          </IonCardContent>
        </IonAccordion>
        
        <div className="task-item-categories">
          {
            categories.map((current : string) => {
              return (
                <IonChip>
                  <IonLabel color="secondary">{current}</IonLabel>
                </IonChip>
              )
            })
          }
        </div>
      </IonCard>
    </>
  );
};

export default TaskItem;