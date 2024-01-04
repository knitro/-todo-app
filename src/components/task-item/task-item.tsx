import React, { useState } from "react";
import {
  IonAccordion,
  IonCard,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPopover,
  IonText,
} from "@ionic/react";
import { Task } from "../../interfaces/tasks";
import {
  checkmarkCircle,
  ellipseOutline,
  ellipsisVertical,
} from "ionicons/icons";
import {
  completeTask,
  deleteTask,
} from "../../firebase/firestore/firestore-tasks";
import "./task-item.css";
import { useHistory } from "react-router";
import Chip from "../general/Chip/chip";

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {
  id: string;
  task: Task;
  loadingFunction: (b: boolean) => void;
  alertFunction: (b: boolean) => void;
  justCompletedCallback: (task: Task) => void;
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
  const task = props.task;
  const header = task.name;
  const notes = task.notes;
  const isComplete = task.isComplete ? task.isComplete : false;
  const categories = task.categories ? task.categories : [];
  const loadingFunction = props.loadingFunction;
  const alertFunction = props.alertFunction;
  const justCompletedCallback = props.justCompletedCallback;

  const history = useHistory();

  ////////////////////////
  /*Hooks*/
  ////////////////////////

  const [checkIcon, setCheckIcon] = useState(
    isComplete ? checkmarkCircle : ellipseOutline
  );
  const [showPopover, setShowPopover] = useState(false);

  ////////////////////////
  /*Functions*/
  ////////////////////////

  const taskCompletionToggle = async () => {
    const oldIcon = checkIcon;
    const newIcon = isComplete ? ellipseOutline : checkmarkCircle;

    setCheckIcon(newIcon);
    justCompletedCallback(task);
    const didCompleteQuery = await completeTask(
      task,
      !isComplete,
      loadingFunction,
      alertFunction
    );
    if (!didCompleteQuery) {
      setCheckIcon(oldIcon);
      alertFunction(true);
    }
  };

  const editFunction = () => {
    setShowPopover(false);
    history.push("/edit/" + id);
  };

  const deleteFunction = () => {
    deleteTask(task, loadingFunction, alertFunction);
    setShowPopover(false);
  };

  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <>
      <IonCard className="task-item-card">
        <IonAccordion value={id}>
          <IonItem
            className="task-item-header"
            slot="header"
            detail={false}
            lines="none"
          >
            <div onClick={taskCompletionToggle}>
              <IonIcon
                className="task-item-checkcircle"
                icon={checkIcon}
                color="primary"
              />
            </div>

            <IonLabel className="task-item-header-text">
              {isComplete ? (
                <i>
                  <s>{header}</s>
                </i>
              ) : (
                <>{header}</>
              )}
            </IonLabel>

            <div id={id + "-popover-button"}>
              <IonIcon
                className="task-item-options-icon"
                icon={ellipsisVertical}
                color="primary"
                onClick={() => setShowPopover(true)}
              />
            </div>
            <IonPopover
              reference="trigger"
              trigger={id + "-popover-button"}
              alignment="end"
              side="bottom"
              isOpen={showPopover}
              onDidDismiss={() => setShowPopover(false)}
            >
              <IonList>
                <IonItem button onClick={editFunction}>
                  Edit
                </IonItem>
                <IonItem button onClick={deleteFunction}>
                  Delete
                </IonItem>
              </IonList>
            </IonPopover>
          </IonItem>

          <IonCardContent slot="content">
            <IonText>
              <b>{header}</b>
            </IonText>
            <br />
            {notes === "" ? (
              <IonText>
                <i>No notes provided</i>
              </IonText>
            ) : (
              <IonText>{notes}</IonText>
            )}
            <br />
            <br />
            {isComplete ? (
              <IonText>
                <i>Date Completed: {task.timestamp.toDateString()}</i>
              </IonText>
            ) : (
              <></>
            )}
          </IonCardContent>
        </IonAccordion>

        <div className="task-item-categories">
          {categories.map((current: string, index: number) => {
            return (
              <Chip
                key={id + "-" + current + "-" + index}
                id={id + "-" + current}
                label={current}
              />
            );
          })}
        </div>
      </IonCard>
    </>
  );
};

export default TaskItem;
