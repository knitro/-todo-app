import { IonAlert, IonButtons, IonCardContent, IonIcon, IonItem, IonList, IonLoading, IonRefresher, IonRefresherContent, IonSearchbar, IonText, IonToolbar, RefresherEventDetail } from "@ionic/react";
import { filter } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import CreateTaskFab from "../../components/fabs/create-task-fab/create-task-fab";
import TaskItem from "../../components/task-item/task-item";
import { getTasksListener } from "../../firebase/firestore/firestore-tasks";
import { Task } from "../../interfaces/tasks";
import PageTemplateDefault from "../page-templates/page-template-default";
import "./tasks-page.css"

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

  const searchFilter = (current : Task) => {
    const searchTextAdjusted = searchText.toLowerCase()
    const nameAdjusted = current.name.toLowerCase()
    const notesAdjusted = current.name.toLowerCase()
    return nameAdjusted.includes(searchTextAdjusted) || notesAdjusted.includes(searchTextAdjusted)
  }

  ////////////////////////
  // Hooks
  ////////////////////////

  const [tasks, setTasks] = useState<Task[]>([])
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isListenerSetup, setListenerSetup] = useState(false)
  const [searchText, setSearchText] = useState('');

  useEffect(() => {

    getTasksListener(setTasks).then((returnValue : boolean) => {
      setListenerSetup(returnValue)
    })

    return function cleanup() {}
  }, []);


  ////////////////////////
  // Functions
  ////////////////////////

  /**
   * The refresh function for the Refresher.
   * It gets the current position, and send it back to the Parent Component to refresh the page
   */
   async function doRefresh(event: CustomEvent<RefresherEventDetail>) : Promise<void> {
    setTimeout(() => {
      event.detail.complete();
    }, 5000);
    setSearchText('')
    if (!isListenerSetup) {
      const returnValue : boolean = await getTasksListener(setTasks);
      setListenerSetup(returnValue)
    }
    event.detail.complete();
  }

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <PageTemplateDefault headerLabel="Tasks" isProfile>

      <IonRefresher slot="fixed" onIonRefresh={doRefresh} id="refresher">
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      {/*Filters*/}
      <IonToolbar className="page-template-transparent">
        <IonSearchbar className="tasks-page-search-bar" value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus"></IonSearchbar>
        <IonButtons slot="end">  
          <IonItem lines="none" className="page-template-transparent">
            <IonIcon icon={filter} size="large" onClick={() => {}}/>
          </IonItem>
        </IonButtons>
      </IonToolbar>

      <IonList className="page-template-transparent">
        {
          (tasks.length === 0)
          ?
          <IonCardContent className="page-template-transparent">
            <IonText><b>Uh Oh :( We appear to be having difficulties</b></IonText>
            <br/>
            <IonText>Please wait and refresh by pulling down to refresh to update your neatest venues!</IonText>
          </IonCardContent>
          : <>
              {
                tasks.filter(searchFilter).map((current : Task, index : number) => {
                  
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

    </PageTemplateDefault>
  );
}

export default TasksPage;