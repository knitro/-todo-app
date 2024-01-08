import {
  IonAccordionGroup,
  IonAlert,
  IonButtons,
  IonCardContent,
  IonIcon,
  IonItem,
  IonList,
  IonLoading,
  IonPopover,
  IonRefresher,
  IonRefresherContent,
  IonSearchbar,
  IonText,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { trashOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import TaskItem from "../../components/task-item/task-item";
import {
  deleteMultipleTasks,
  getTasksListener,
} from "../../firebase/firestore/firestore-tasks";
import { Task } from "../../interfaces/tasks";
import PageTemplateDefault from "../page-templates/page-template-default";
import "./history-page.css";
import { useLocation } from "react-router";

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props {}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const TasksPage: React.FC<Props> = (props: Props) => {
  ////////////////////////
  // Hooks
  ////////////////////////

  const [tasks, setTasks] = useState<Task[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isListenerSetup, setListenerSetup] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [showBinPopover, setShowBinPopover] = useState(false);
  const [justUnCompletedTasks, setJustCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    const emptyFunction = (a: string[]) => {};
    getTasksListener(setTasks, emptyFunction).then((returnValue: boolean) => {
      setListenerSetup(returnValue);
    });

    return function cleanup() {};
  }, []);

  // Code to Check for Route URL Change --> Reset justCompletedTasks
  const location = useLocation();
  useEffect(() => {
    emptyUncompletedTaskArray();
  }, [location]);

  ////////////////////////
  // Functions
  ////////////////////////

  /**
   * The refresh function for the Refresher.
   * It gets the current position, and send it back to the Parent Component to refresh the page
   */
  async function doRefresh(
    event: CustomEvent<RefresherEventDetail>
  ): Promise<void> {
    setTimeout(() => {
      event.detail.complete();
    }, 5000);
    setSearchText("");
    if (!isListenerSetup) {
      const emptyFunction = (a: string[]) => {};
      const returnValue: boolean = await getTasksListener(
        setTasks,
        emptyFunction
      );
      setListenerSetup(returnValue);
    }
    event.detail.complete();
  }

  const searchFilter = (current: Task) => {
    const searchTextAdjusted = searchText.toLowerCase();
    const nameAdjusted = current.name.toLowerCase();
    const notesAdjusted = current.name.toLowerCase();
    return (
      nameAdjusted.includes(searchTextAdjusted) ||
      notesAdjusted.includes(searchTextAdjusted)
    );
  };

  const isCompleteFilter = (current: Task) => {
    if (current.isComplete) {
      return true;
    }

    if (justUnCompletedTasks.includes(current.id)) {
      return true;
    }
    return false;
  };

  const justUncompletedCallback = (task: Task) => {
    if (justUnCompletedTasks.includes(task.id)) {
      return;
    }
    const updatedArray = [...justUnCompletedTasks];
    updatedArray.push(task.id);
    setJustCompletedTasks(updatedArray);
  };

  const emptyUncompletedTaskArray = () => {
    setJustCompletedTasks([]);
  };

  const deleteAllCompleted = () => {
    const tasksToDelete = tasks.filter(isCompleteFilter);
    deleteMultipleTasks(tasksToDelete, setShowLoading, setShowAlert);
  };

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <PageTemplateDefault headerLabel="History" isProfile>
      <IonRefresher slot="fixed" onIonRefresh={doRefresh} id="refresher">
        <IonRefresherContent></IonRefresherContent>
      </IonRefresher>

      {/*Search Bar*/}
      <IonToolbar className="background-color">
        <IonSearchbar
          className="tasks-page-search-bar"
          value={searchText}
          onIonInput={(e) => setSearchText(e.detail.value!)}
          showCancelButton="focus"
        ></IonSearchbar>
        <IonButtons slot="end">
          <IonItem lines="none" className="background-color" button>
            <IonIcon
              id="bin-button"
              icon={trashOutline}
              size="large"
              onClick={() => setShowBinPopover(true)}
            />
          </IonItem>
        </IonButtons>
      </IonToolbar>

      <IonPopover
        reference="trigger"
        trigger="bin-button"
        alignment="end"
        side="bottom"
        isOpen={showBinPopover}
        onDidDismiss={() => setShowBinPopover(false)}
      >
        <IonList>
          <IonItem
            button
            onClick={() => {
              deleteAllCompleted();
              setShowBinPopover(false);
            }}
          >
            Delete All Completed
            <IonIcon icon={trashOutline} slot="end" />
          </IonItem>
        </IonList>
      </IonPopover>

      <IonList className="background-color">
        {tasks.length === 0 ? (
          <IonCardContent className="page-template-transparent">
            <IonText>
              <b>Uh Oh :( We appear to be having difficulties</b>
            </IonText>
            <br />
            <IonText>
              Please refresh by pulling down on your screen to sync up your
              notes!
            </IonText>
          </IonCardContent>
        ) : (
          <IonAccordionGroup>
            {tasks
              .filter(isCompleteFilter)
              .filter(searchFilter)
              .map((current: Task, index: number) => {
                const id = current.id;
                return (
                  <TaskItem
                    key={id}
                    id={id}
                    task={current}
                    loadingFunction={setShowLoading}
                    alertFunction={setShowAlert}
                    justCompletedCallback={justUncompletedCallback}
                  />
                );
              })}
          </IonAccordionGroup>
        )}
      </IonList>

      <IonLoading
        cssClass=""
        isOpen={showLoading}
        onDidDismiss={() => setShowLoading(false)}
        message={"Please wait..."}
        duration={8000}
      />

      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => setShowAlert(false)}
        cssClass="failed"
        header={"Error"}
        subHeader={"Something has gone wrong."}
        message={
          "Take care of yourself, and we'll take care in figuring out what went wrong here!"
        }
        buttons={["Okay"]}
      />
    </PageTemplateDefault>
  );
};

export default TasksPage;
