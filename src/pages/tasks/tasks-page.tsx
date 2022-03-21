import { IonCardContent, IonContent, IonList, IonPage, IonRefresher, IonRefresherContent, IonText, RefresherEventDetail } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import Header from "../../components/general/Header/Header";
import TaskItem from "../../components/task-item/task-item";
import { auth } from "../../firebase/firebase";
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

  /**
   * The refresh function for the Refresher.
   * It gets the current position, and send it back to the Parent Component to refresh the page
   */
   async function doRefresh(event: CustomEvent<RefresherEventDetail>) : Promise<void> {
    setTimeout(() => {
      event.detail.complete();
    }, 5000);
    
    const tasks = await getTasks()
    setTasks(tasks)
    event.detail.complete();
  }

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <IonPage>
      <Header headerLabel="To Do"/>
      <IonContent>

        <IonRefresher slot="fixed" onIonRefresh={doRefresh} id="refresher">
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

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