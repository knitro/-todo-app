import {
  IonAccordionGroup,
  IonAlert,
  IonButtons,
  IonCardContent,
  IonCol,
  IonGrid,
  IonIcon,
  IonItem,
  IonList,
  IonLoading,
  IonPopover,
  IonRefresher,
  IonRefresherContent,
  IonRow,
  IonSearchbar,
  IonText,
  IonToolbar,
  RefresherEventDetail,
} from "@ionic/react";
import { checkmark, timeOutline } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import CreateTaskFab from "../../components/fabs/create-task-fab/create-task-fab";
import TaskItem from "../../components/task-item/task-item";
import { getTasksListener } from "../../firebase/firestore/firestore-tasks";
import { Task } from "../../interfaces/tasks";
import PageTemplateDefault from "../page-templates/page-template-default";
import "./tasks-page.css";
import Chip from "../../components/general/Chip/chip";
import { v4 } from "uuid";
import { Timeframe } from "../../enums/timeframe";
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
  const [categories, setCategories] = useState<string[]>([]);
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [isListenerSetup, setListenerSetup] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("");
  const [showTimePopover, setShowTimePopover] = useState(false);
  const [filterTime, setFilterTime] = useState(Timeframe.NONE);
  const [justCompletedTasks, setJustCompletedTasks] = useState<string[]>([]);

  useEffect(() => {
    getTasksListener(setTasks, setCategories).then((returnValue: boolean) => {
      setListenerSetup(returnValue);
    });

    return function cleanup() {};
  }, []);

  // Code to Check for Route URL Change --> Reset justCompletedTasks
  const location = useLocation();
  useEffect(() => {
    emptyCompletedTaskArray();
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
      const returnValue: boolean = await getTasksListener(
        setTasks,
        setCategories
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

  const nonCompleteFilter = (current: Task) => {
    if (!current.isComplete) {
      return true;
    }

    if (justCompletedTasks.includes(current.id)) {
      return true;
    }
    return false;
  };

  const categoryFilter = (current: Task) => {
    if (filterCategory && filterCategory !== "") {
      if (current.categories) {
        return current.categories.includes(filterCategory);
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const timeFilter = (current: Task) => {
    if (filterTime && filterTime !== Timeframe.NONE) {
      if (current.timeframe) {
        return current.timeframe === filterTime;
      } else {
        return false;
      }
    } else {
      return true;
    }
  };

  const setFilterCategoryCallback = (selectedFilterCategory: string) => {
    if (selectedFilterCategory === filterCategory) {
      setFilterCategory("");
    } else {
      setFilterCategory(selectedFilterCategory);
    }
  };

  const setFilterTimeCallback = (selectedFilterTime: Timeframe) => {
    if (selectedFilterTime === filterCategory) {
      setFilterTime(Timeframe.NONE);
    } else {
      setFilterTime(selectedFilterTime);
    }
  };

  const justCompletedCallback = (task: Task) => {
    if (justCompletedTasks.includes(task.id)) {
      return;
    }
    const updatedArray = [...justCompletedTasks];
    updatedArray.push(task.id);
    setJustCompletedTasks(updatedArray);
  };

  const emptyCompletedTaskArray = () => {
    setJustCompletedTasks([]);
  };

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <PageTemplateDefault headerLabel="Tasks" isProfile>
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
              id="clock-button"
              icon={timeOutline}
              size="large"
              onClick={() => setShowTimePopover(true)}
            />
          </IonItem>
        </IonButtons>
      </IonToolbar>

      <IonPopover
        reference="trigger"
        trigger="clock-button"
        alignment="end"
        side="bottom"
        isOpen={showTimePopover}
        onDidDismiss={() => setShowTimePopover(false)}
      >
        <IonList>
          {Object.values(Timeframe).map((currentTimeframe) => {
            return (
              <IonItem
                button
                key={v4()}
                onClick={() => {
                  setFilterTimeCallback(currentTimeframe);
                  setShowTimePopover(false);
                }}
              >
                {filterTime === currentTimeframe && (
                  <IonIcon icon={checkmark} slot="end" />
                )}
                {currentTimeframe}
              </IonItem>
            );
          })}
        </IonList>
      </IonPopover>

      <IonGrid>
        <IonRow className="scroll-horizontal">
          {categories.length === 0 ? (
            <IonCol>
              <IonText>
                <i>No categories currently set</i>
              </IonText>
            </IonCol>
          ) : (
            <>
              {categories.map((currentCategory) => {
                return (
                  <IonCol size="auto" key={"category-row-" + currentCategory}>
                    <Chip
                      id={currentCategory}
                      label={currentCategory}
                      clickFunction={() =>
                        setFilterCategoryCallback(currentCategory)
                      }
                      showCheckmark={filterCategory === currentCategory}
                    />
                  </IonCol>
                );
              })}
            </>
          )}
        </IonRow>
      </IonGrid>

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
              .filter(nonCompleteFilter)
              .filter(searchFilter)
              .filter(categoryFilter)
              .filter(timeFilter)
              .map((current: Task, index: number) => {
                const id = current.id;
                return (
                  <TaskItem
                    key={id}
                    id={id}
                    task={current}
                    loadingFunction={setShowLoading}
                    alertFunction={setShowAlert}
                    justCompletedCallback={justCompletedCallback}
                  />
                );
              })}
          </IonAccordionGroup>
        )}
      </IonList>

      <CreateTaskFab />

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
