import { IonAccordion, IonAccordionGroup, IonAlert, IonButton, IonButtons, IonCardContent, IonIcon, IonItem, IonLabel, IonList, IonLoading, IonRefresher, IonRefresherContent, IonSearchbar, IonSelect, IonSelectOption, IonText, IonToolbar, RefresherEventDetail } from "@ionic/react";
import { close, filter } from "ionicons/icons";
import React, { useEffect, useRef, useState } from "react";
import CreateTaskFab from "../../components/fabs/create-task-fab/create-task-fab";
import TaskItem from "../../components/task-item/task-item";
import { getTasksListener } from "../../firebase/firestore/firestore-tasks";
import { Task } from "../../interfaces/tasks";
import PageTemplateDefault from "../page-templates/page-template-default";

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props {}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const TasksPage : React.FC<Props> = (props : Props) => {

  ////////////////////////
  // Hooks
  ////////////////////////

  const [tasks, setTasks] = useState<Task[]>([])
  const [categories, setCategories] = useState<string[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isListenerSetup, setListenerSetup] = useState(false)
  const [searchText, setSearchText] = useState('');
  const [filterShow, setFilterShow] = useState("") // Either "" or "filter"
  const [filterCategory, setFilterCategory] = useState<string>("");

  useEffect(() => {
    getTasksListener(setTasks, setCategories).then((returnValue : boolean) => {
      setListenerSetup(returnValue)
    })

    return function cleanup() {}
  }, []);

  const categoryFilterSelectRef = useRef<HTMLIonSelectElement>(null)

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
      const returnValue : boolean = await getTasksListener(setTasks, setCategories);
      setListenerSetup(returnValue)
    }
    event.detail.complete();
  }

  const searchFilter = (current : Task) => {
    const searchTextAdjusted = searchText.toLowerCase()
    const nameAdjusted = current.name.toLowerCase()
    const notesAdjusted = current.name.toLowerCase()
    return nameAdjusted.includes(searchTextAdjusted) || notesAdjusted.includes(searchTextAdjusted)
  }

  const isCompleteFilter = (current : Task) => {
    return current.isComplete;
  }

  const categoryFilter = (current : Task) => {
    if (filterCategory && filterCategory !== "") {
      if (current.categories) {
        return current.categories.includes(filterCategory)
      } else {
        return false 
      }
    } else {
      return true;
    }
  }

  const doOpenFilters = () => {
    if (filterShow === "") {
      setFilterShow("filters")
    } else {
      setFilterShow("")
    }
  }

  const removeFilters = () => {
    setFilterCategory("")
    if (categoryFilterSelectRef && categoryFilterSelectRef.current) {
      categoryFilterSelectRef.current.value = undefined 
    }
  }

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <PageTemplateDefault headerLabel="History" isProfile>

      <IonRefresher slot="fixed" onIonRefresh={doRefresh} id="refresher">
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      {/*Search Bar*/}
      <IonToolbar className="page-template-transparent">
        <IonSearchbar className="tasks-page-search-bar" value={searchText} onIonChange={e => setSearchText(e.detail.value!)} showCancelButton="focus"></IonSearchbar>
        <IonButtons slot="end">  
          <IonItem lines="none" className="page-template-transparent" button onClick={doOpenFilters}>
            <IonIcon icon={filter} size="large" onClick={() => {}}/>
          </IonItem>
        </IonButtons>
      </IonToolbar>

      {/*Filters*/}
      <IonAccordionGroup className="page-template-transparent" value={filterShow}>
        <IonAccordion value="filters" className="page-template-transparent">
          <IonList slot="content" className="page-template-transparent">
            <IonToolbar className="page-template-transparent tasks-page-filter-toolbar">
              <IonItem>
                <IonLabel>Category Filter</IonLabel>
                <IonSelect ref={categoryFilterSelectRef} placeholder="Select One" onIonChange={e => setFilterCategory(e.detail.value)}>
                  {
                    categories.map((categoryString : string) => 
                      <IonSelectOption key={"filter-select-" + categoryString} value={categoryString}>{categoryString}</IonSelectOption>
                    )
                  }
                </IonSelect>
              </IonItem>
              <IonButton className="tasks-page-filter-cancel" slot="end" onClick={removeFilters}>
                <IonIcon icon={close}/>
              </IonButton>
            </IonToolbar>
            
          </IonList>
        </IonAccordion>
      </IonAccordionGroup>

      <IonList className="page-template-transparent">
        {
          (tasks.length === 0)
          ?
          <IonCardContent className="page-template-transparent">
            <IonText><b>Uh Oh :( We appear to be having difficulties</b></IonText>
            <br/>
            <IonText>Please refresh by pulling down on your screen to sync up your notes!</IonText>
          </IonCardContent>
          : <IonAccordionGroup>
              {
                tasks.filter(isCompleteFilter).filter(searchFilter).filter(categoryFilter).map((current : Task, index : number) => {
                  const id = current.id
                  return (
                    <TaskItem key={id} id={id} task={current} loadingFunction={setShowLoading} alertFunction={setShowAlert}/>
                  )
                })
              }
            </IonAccordionGroup> 
        }
      </IonList>

      <CreateTaskFab />

      <IonLoading
        cssClass=''
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={'Please wait...'}
        duration={8000}
      />

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass='failed'
        header={'Error'}
        subHeader={'Something has gone wrong.'}
        message={"Take care of yourself, and we'll take care in figuring out what went wrong here!"}
        buttons={['Okay']}
      />

    </PageTemplateDefault>
  );
}

export default TasksPage;