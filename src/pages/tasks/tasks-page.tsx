import { IonAlert, IonButtons, IonCardContent, IonContent, IonIcon, IonItem, IonList, IonLoading, IonPage, IonRefresher, IonRefresherContent, IonText, IonToolbar, RefresherEventDetail } from "@ionic/react";
import { filter } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import CreateTaskFab from "../../components/fabs/create-task-fab/create-task-fab";
import Header from "../../components/general/Header/Header";
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
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

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
      <Header headerLabel="Checklist"/>
      <IonContent>

        <IonRefresher slot="fixed" onIonRefresh={doRefresh} id="refresher">
          <IonRefresherContent></IonRefresherContent>
        </IonRefresher>

        {/*Filters*/}
        <IonToolbar>
          <IonButtons slot="end">  
            <IonItem lines="none">
              <IonIcon icon={filter} size="large" onClick={() => {}}/>
            </IonItem>
          </IonButtons>
        </IonToolbar>

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
                    tasks.map((current : Task, index : number) => {
                      
                      const id = "task-item-" + index

                      return (
                        <TaskItem key={id} id={id} task={current} loadingFunction={setShowLoading} alertFunction={setShowAlert}/>
                      )
                    })
                  }
                </> 
            }
          </IonList>
          <CreateTaskFab />
      </IonContent>
      
      <IonLoading
        cssClass=''
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Adding Task, please wait...'}
        duration={8000}
      />

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass='failed'
        header={'Error'}
        subHeader={'Missing Title'}
        message={'Each task must have a title. Please add one.'}
        buttons={['Okay']}
      />

    </IonPage>
  );
}

export default TasksPage;