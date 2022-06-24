import React, { useState } from 'react';
import { IonAccordion, IonCard, IonCardContent, IonChip, IonIcon, IonItem, IonLabel, IonList, IonPopover, IonText } from "@ionic/react";
import { Task } from '../../interfaces/tasks';
import { checkmarkCircle, ellipseOutline, ellipsisVertical } from 'ionicons/icons';
import { completeTask, deleteTask } from '../../firebase/firestore/firestore-tasks';
import "./task-item.css"
import { stringToHexColour } from '../../logic/get-colour';
import { useHistory } from 'react-router';

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

  //Props
  const id = props.id;
  const task = props.task
  const header = task.name
  const notes = task.notes
  const isComplete = (task.isComplete) ? task.isComplete : false
  const categories = (task.categories) ? task.categories : []
  const loadingFunction = props.loadingFunction
  const alertFunction = props.alertFunction
  
  const history = useHistory()

  ////////////////////////
  /*Hooks*/
  ////////////////////////

  const [checkIcon, setCheckIcon] = useState(isComplete ? checkmarkCircle : ellipseOutline)
  const [showPopover, setShowPopover] = useState(false);

  ////////////////////////
  /*Functions*/
  ////////////////////////

  const taskCompletionToggle = async () => {
    setCheckIcon(checkmarkCircle)
    const didComplete = await completeTask(task, !isComplete, loadingFunction, alertFunction)
    if (!didComplete) {
      setCheckIcon(ellipseOutline)
      alertFunction(true)
    }
  }

  const editFunction = () => {
    setShowPopover(false)
    history.push("edit/" + id)
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

            <IonLabel className="task-item-header-text">
              {
                (isComplete)
                ? <i><s>{header}</s></i>
                : <>{header}</>
              }
            </IonLabel>
            
            <div id={id + "-popover-button"}>
              <IonIcon className="task-item-options-icon" icon={ellipsisVertical} color="primary" onClick={() => setShowPopover(true)}/>
            </div>
            <IonPopover reference="trigger" trigger={id + "-popover-button"} alignment="end" side="bottom" isOpen={showPopover} onDidDismiss={() => setShowPopover(false)}>
              <IonList>
                <IonItem button onClick={editFunction}>Edit</IonItem>
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
              
              const style = {
                color: stringToHexColour(current),
              }

              return (
                <IonChip key={id + "-" + current} style={style}>
                  <IonLabel>{current}</IonLabel>
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