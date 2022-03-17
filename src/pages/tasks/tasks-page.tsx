import { IonCardContent, IonContent, IonList, IonPage, IonText } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "../../components/general/Header/Header";
import ListItemClickable from "../../components/general/List/ListItemClickable";
import TaskItem from "../../components/task-item/task-item";
import { getTasks } from "../../firebase/firestore/firestore-tasks";
import { Task } from "../../interfaces/tasks";

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props {}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const TasksPage : React.FC<Props> = (props : Props) => {

  ////////////////////////
  // Variables
  ////////////////////////

  const [tasks, setTasks] = useState<Task[]>([])

  useEffect(() => {

    function handleAsync(current : Task[]) {
      setTasks(current);
    }

    getTasks().then( (current : Task[]) => {
      handleAsync(current)
    });

    return function cleanup() {}
  }, []);

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <IonPage>
      <Header headerLabel="To Do"/>
      <IonContent>
        <IonList>
            {
              (tasks.length === 0)
              ?
              <IonCardContent>
                <IonText><b>Uh Oh :( We appear to be having difficulties</b></IonText>
                <br/>
                <IonText>Please wait and refresh by pulling down to refresh to update your neatest venues!</IonText>
              </IonCardContent>
              : <>
                  {
                    tasks.map((current : Task) => 
                      <TaskItem key={v4()} task={current}/>
                    )
                  }
                </> 
            }
          </IonList>
      </IonContent>
    </IonPage>
  );
}

export default TasksPage;