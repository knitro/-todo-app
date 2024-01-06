import {
  IonAccordion,
  IonAlert,
  IonButton,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonLoading,
  IonPage,
  IonRow,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonToolbar,
} from "@ionic/react";
import {
  addCircleOutline,
  albumsOutline,
  newspaperOutline,
  trashBinOutline,
} from "ionicons/icons";
import React, { KeyboardEvent, useEffect, useState } from "react";
import { v4 } from "uuid";
import { Timeframe } from "../../enums/timeframe";
import { Task } from "../../interfaces/tasks";
import { createTask, getTask } from "../../firebase/firestore/firestore-tasks";
import { useHistory } from "react-router";
import { getCategories } from "../../logic/get-categories";
import "./task-form.css";
import Chip from "../../components/general/Chip/chip";
import { getFromStorage } from "../../capacitor/storage";
import { CATEGORIES_STORAGE_KEY } from "../../constants/constants";

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props {
  id?: string;
  isEdit?: boolean;
}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const TaskFormPage: React.FC<Props> = (props: Props) => {
  ////////////////////////
  // Variables
  ////////////////////////

  const history = useHistory();
  const id = props.id ? props.id : v4();
  const pageTitle = props.isEdit ? "Edit Task" : "Create Task";

  ////////////////////////
  // Hooks
  ////////////////////////

  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMissingTitle, setShowAlertMissingTitle] = useState(false);

  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [categoryField, setCategoryField] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([]);
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.NONE);

  const [savedCategories, setSavedCategories] = useState<string[]>([]);
  const [showSavedCategories, setShowSavedCategories] = useState(false);

  useEffect(() => {
    if (props.id) {
      setShowLoading(true);
      getTask(id).then((value: Task | false) => {
        if (value !== false) {
          setTitle(value.name);
          setBody(value.notes);
          if (value.categories) {
            setCategories(value.categories);
          }
          if (value.timeframe) {
            setTimeframe(value.timeframe);
          }

          setShowLoading(false);
        }
      });
    }
  }, [props.id, id]);

  useEffect(() => {
    async function getCategories() {
      const existingCategories = await getFromStorage<string[]>(
        CATEGORIES_STORAGE_KEY
      );
      if (existingCategories != null) {
        setSavedCategories(existingCategories);
      }
    }

    getCategories();
  }, []);

  ////////////////////////
  // Functions
  ////////////////////////

  const cancelButtonListener = () => {
    history.goBack();
  };

  const createTaskButtonListener = async () => {
    if (title === "") {
      setShowAlert(true);
    } else {
      const splitter: { name: string; categories: string[] } =
        getCategories(title);
      const newTask: Task = {
        id: id,
        name: splitter.name,
        categories: splitter.categories.concat(categories),
        timeframe: timeframe,
        notes: body,
        isComplete: false,
        timestamp: new Date(), // Arbitrary Value as this is overridden with Timestamp.now()
      };
      await createTask(newTask, setShowLoading, setShowAlert);
      resetFields();
      history.push("/tasks");
    }
  };

  const categoryFieldUpdater = (event: Event) => {
    const value = (event.target as HTMLIonInputElement).value as string;
    setCategoryField(value);
  };

  const categoryFieldListener = (event: KeyboardEvent<HTMLIonInputElement>) => {
    if (event.key === "Enter") {
      const category = categoryField;
      addToCategories(category);
    }
  };

  const chipListener = (categoryToRemove: string) => {
    const set = new Set(categories);
    set.delete(categoryToRemove);
    setCategories(Array.from(set));
  };

  const addToCategories = (categoryToAdd: string) => {
    const currentCategories = [...categories];
    if (!currentCategories.includes(categoryToAdd)) {
      currentCategories.push(categoryToAdd);
      setCategories(currentCategories);
      console.log(currentCategories);
    }
    setCategoryField("");
  };

  const resetFields = () => {
    setTitle("");
    setBody("");
    setTimeframe(Timeframe.NONE);
    setCategories([]);
  };

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <IonPage className="task-form">
      <IonContent fullscreen>
        <div className="task-form-title">
          <IonText className="task-form-title-text">{pageTitle}</IonText>
        </div>

        <IonCard>
          <IonItem>
            <IonTextarea
              autofocus
              placeholder="Task"
              autoGrow
              value={title}
              onIonChange={(e) => setTitle(e.detail.value!)}
              onIonFocus={() => setShowSavedCategories(false)}
            ></IonTextarea>
          </IonItem>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonInput
              placeholder="Add categories"
              value={categoryField}
              // onIonChange={(event) => setCategoryField(event.detail.value!)}
              onIonInput={categoryFieldUpdater}
              onKeyUp={categoryFieldListener}
              onIonFocus={() => setShowSavedCategories(true)}
            >
              <div slot="label">
                <IonIcon color="secondary" icon={albumsOutline}></IonIcon>
              </div>
            </IonInput>
          </IonItem>

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
                      <IonCol
                        size="auto"
                        key={"category-row-" + currentCategory}
                      >
                        <Chip
                          id={currentCategory}
                          label={currentCategory}
                          clickFunction={() => chipListener(currentCategory)}
                          showCross
                        />
                      </IonCol>
                    );
                  })}
                </>
              )}
            </IonRow>
          </IonGrid>
          <div hidden={!showSavedCategories}>
            <IonList>
              <IonListHeader>
                <IonLabel>Recent Categories</IonLabel>
              </IonListHeader>
              {savedCategories
                .filter(
                  (currentCategory) => !categories.includes(currentCategory)
                )
                .map((currentCategory) => (
                  <IonItem
                    button
                    onClick={() => addToCategories(currentCategory)}
                    key={"savedCategory-" + currentCategory}
                  >
                    <Chip
                      id={currentCategory}
                      label={currentCategory}
                      clickFunction={() => chipListener(currentCategory)}
                    />
                  </IonItem>
                ))}
            </IonList>
          </div>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonSelect
              value={timeframe}
              placeholder="Select One"
              onIonChange={(e) => setTimeframe(e.detail.value)}
              onIonFocus={() => setShowSavedCategories(false)}
            >
              {Object.keys(Timeframe).map((currentTimeframe) => (
                <IonSelectOption key={v4()} value={currentTimeframe}>
                  {Timeframe[currentTimeframe as keyof typeof Timeframe]}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </IonCard>

        <IonCard>
          <IonItem>
            <IonTextarea
              placeholder="Further Details"
              autoGrow
              value={body}
              onIonChange={(e) => setBody(e.detail.value!)}
              onIonFocus={() => setShowSavedCategories(false)}
            >
              <div slot="label">
                <IonIcon color="warning" icon={newspaperOutline}></IonIcon>
              </div>
            </IonTextarea>
          </IonItem>
        </IonCard>
      </IonContent>

      <IonFooter translucent className="ion-no-border">
        <IonToolbar>
          <IonGrid fixed>
            <IonRow>
              <IonCol>
                <IonButton
                  color="danger"
                  expand="block"
                  shape="round"
                  size="large"
                  fill="clear"
                  onClick={cancelButtonListener}
                >
                  <IonIcon icon={trashBinOutline} slot="start" />
                  Cancel
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  expand="block"
                  shape="round"
                  size="large"
                  fill="clear"
                  onClick={createTaskButtonListener}
                >
                  <IonIcon icon={addCircleOutline} slot="start" />
                  <IonLabel>
                    <IonText>{pageTitle}</IonText>
                  </IonLabel>
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonToolbar>
      </IonFooter>

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
        subHeader={"Missing Title"}
        message={"Each task must have a title. Please add one."}
        buttons={["Okay"]}
      />

      <IonAlert
        isOpen={showAlertMissingTitle}
        onDidDismiss={() => setShowAlertMissingTitle(false)}
        cssClass="failed"
        header={"Error"}
        subHeader={"Missing Title"}
        message={"Each task must have a title. Please add one."}
        buttons={["Okay"]}
      />
    </IonPage>
  );
};

export default TaskFormPage;
