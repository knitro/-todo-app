import { IonAlert, IonButton, IonContent, IonIcon, IonInput, IonItem, IonLabel, IonLoading, IonPage, IonSelect, IonSelectOption, IonText, IonTextarea, IonToolbar } from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import React, { useState } from "react";
import { v4 } from "uuid";
import { Categories } from "../../enums/categories";
import { Colours } from "../../enums/colours";
import { Task } from "../../interfaces/tasks";
import { createTask } from "../../firebase/firestore/firestore-tasks"
import { useHistory } from "react-router";
import PageTemplateNoContent from "../page-templates/page-template-no-content";
import "./create-task-page.css"

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props {}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const CreateTaskPage : React.FC<Props> = () => {

  ////////////////////////
  // Variables
  ////////////////////////

  const history = useHistory()

  // Hooks
  const [showLoading, setShowLoading] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertMissingTitle, setShowAlertMissingTitle] = useState(false);

  const [title, setTitle] = useState<string>("");
  const [body, setBody] = useState<string>("");
  const [category, setCategory] = useState<Categories>(Categories.NONE);
  const [color, setColor] = useState<Colours>(Colours.Blue);
  
  ////////////////////////
  // Functions 
  ////////////////////////

  const createButtonListener = async () => {
    if (title === "") {
      setShowAlert(true)
    } else {
      const newTask : Task = {
        id        : v4(),
        name      : title,
        category  : category,
        colour    : color,
        notes     : body,
      }
      await createTask(newTask, setShowLoading, setShowAlert)
      resetFields()
      history.push("tasks")
    }
  }

  const resetFields = () => {
    setTitle("")
    setBody("")
    setCategory(Categories.NONE)
    setColor(Colours.Blue)
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
          <IonInput placeholder="Insert the name of your task here" value={title} onIonChange={e => setTitle(e.detail.value!)}></IonInput>
        </IonItem>

        <IonItem>
          <IonLabel>Category</IonLabel>
          <IonSelect value={category} placeholder="Select One" onIonChange={e => setCategory(e.detail.value)}>
            {
              Object.keys(Categories).map((currentCategory) =>
                <IonSelectOption key={v4()} value={currentCategory}>{Categories[currentCategory as keyof typeof Categories]}</IonSelectOption>
              )
            }
          </IonSelect>
        </IonItem>

        <IonItem>
          <IonLabel>Colour</IonLabel>
          <IonSelect value={color} placeholder="Select One" onIonChange={e => setColor(e.detail.value)}>
          {
              Object.keys(Colours).map((currentColour) =>
                <IonSelectOption key={v4()} value={currentColour}>{currentColour}</IonSelectOption>
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

export default CreateTaskPage;