import { IonAlert, IonButton, IonChip, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonSelect, IonSelectOption, IonText, IonTextarea, IonToolbar } from "@ionic/react";
import { addCircleOutline, closeCircle } from "ionicons/icons";
import React, { useEffect, useState } from "react";
import { v4 } from "uuid";
import { Timeframe } from "../../enums/timeframe";
import { Task } from "../../interfaces/tasks";
import { createTask, getTask } from "../../firebase/firestore/firestore-tasks"
import { useHistory } from "react-router";
import PageTemplateNoContent from "../page-templates/page-template-no-content";
import { getCategories } from "../../logic/get-categories";
import "./task-form.css"
import { stringToHexColour } from "../../logic/get-colour";

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props {
  id? : string
}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const TaskFormPage : React.FC<Props> = (props : Props) => {

  ////////////////////////
  // Variables
  ////////////////////////

  const history = useHistory()
  const id = (props.id) ? props.id : v4()

  ////////////////////////
  // Hooks 
  ////////////////////////

  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMissingTitle, setShowAlertMissingTitle] = useState(false);

  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [categoryField, setCategoryField] = useState<string>("");
  const [categories, setCategories] = useState<string[]>([])
  const [timeframe, setTimeframe] = useState<Timeframe>(Timeframe.NONE);
  
  useEffect(() => {
    console.log("run")
    if (props.id) {
      setShowLoading(true)
      getTask(id).then((value : Task | false) => {
        if (value !== false) {
          setTitle(value.name)
          setBody(value.notes)
          if (value.categories) {
            setCategories(value.categories)
          }
          if (value.timeframe) {
            setTimeframe(value.timeframe)
          }

          setShowLoading(false)
        }
      })
    }
   }, [props.id, id])

  ////////////////////////
  // Functions 
  ////////////////////////

  const createButtonListener = async () => {
    if (title === "") {
      setShowAlert(true)
    } else {

      const splitter : {name : string, categories : string[]} = getCategories(title)
      const newTask : Task = {
        id          : id,
        name        : splitter.name,
        categories  : splitter.categories.concat(categories),
        timeframe   : timeframe,
        notes       : body,
        isComplete  : false,
        timestamp   : new Date() // Arbitrary Value as this is overridden with Timestamp.now()
      }
      await createTask(newTask, setShowLoading, setShowAlert)
      resetFields()
      history.push("tasks")
    }
  }

  const categoryFieldListener = (event : React.KeyboardEvent<HTMLIonInputElement>) => {
    if (event.key === "Enter") {
      const category = categoryField
      setCategoryField("")
      if (!categories.includes(category)) {
        categories.push(category)
        setCategories(categories)
      }
    }
  } 

  const chipListener = (categoryToRemove : string) => {
    const set = new Set(categories);
    set.delete(categoryToRemove)
    setCategories(Array.from(set))
  }

  const resetFields = () => {
    setTitle("")
    setBody("")
    setTimeframe(Timeframe.NONE)
  }

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <PageTemplateNoContent headerLabel="Create Task" backButton>
      <IonContent className="page-template-transparent">
        <div className="create-task-page-curve-backdrop"></div>
        <IonItem>
          <IonLabel position="floating">Name of Task</IonLabel>
          <IonInput autofocus placeholder="Add the name of your task here" value={title} onIonChange={e => setTitle(e.detail.value!)}></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Categories</IonLabel>
          <IonInput placeholder="Add new categories here" value={categoryField} onIonChange={event => setCategoryField(event.detail.value!)} onKeyPress={categoryFieldListener}></IonInput>
          <IonItem>
            {
              (categories.length === 0)
              ? <IonText><i>No categories currently set</i></IonText>
              : <>
                {
                  categories.map((currentCategory) => {
                    const style = {
                      color: stringToHexColour(currentCategory),
                    }
                    return (
                      <IonChip key={"category-chip-" + currentCategory} onClick={() => chipListener(currentCategory)} style={style}>
                        <IonLabel>{currentCategory}</IonLabel>
                        <IonIcon icon={closeCircle} />
                      </IonChip>
                    )
                  })
                }
                </>
            }
          </IonItem>
        </IonItem>

        <IonItem>
          <IonLabel>Timeframe</IonLabel>
          <IonSelect value={timeframe} placeholder="Select One" onIonChange={e => setTimeframe(e.detail.value)}>
            {
              Object.keys(Timeframe).map((currentTimeframe) =>
                <IonSelectOption key={v4()} value={currentTimeframe}>{Timeframe[currentTimeframe as keyof typeof Timeframe]}</IonSelectOption>
              )
            }
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel position="floating">Notes</IonLabel>
          <IonTextarea placeholder="Insert any notes about your task here" value={body} onIonChange={e => setBody(e.detail.value!)}></IonTextarea>
        </IonItem>
        
        <div className="create-task-space-white-spacer"></div>

      </IonContent>

      <IonToolbar slot="fixed" className="bottom">
        <IonButton color="primary" expand="block" size="large" onClick={createButtonListener}>
          <IonIcon icon={addCircleOutline} slot="start"/>
          <IonLabel>
            <IonText>Create Task</IonText>
          </IonLabel>
        </IonButton>
      </IonToolbar>

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
        subHeader={'Missing Title'}
        message={'Each task must have a title. Please add one.'}
        buttons={['Okay']}
      />

      <IonAlert
        isOpen={showAlertMissingTitle}
        onDidDismiss={() => setShowAlertMissingTitle(false)}
        cssClass='failed'
        header={'Error'}
        subHeader={'Missing Title'}
        message={'Each task must have a title. Please add one.'}
        buttons={['Okay']}
      />

    </PageTemplateNoContent>
  );
}

export default TaskFormPage;
