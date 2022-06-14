import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import CreateTaskFab from "../../components/fabs/create-task-fab/create-task-fab";
import Header from "../../components/general/Header/Header";

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props {}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const HistoryPage : React.FC<Props> = (props : Props) => {

  ////////////////////////
  // Variables
  ////////////////////////

  // Nothing

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <IonPage>
      <Header headerLabel="To Do"/>
      <IonContent>
        <CreateTaskFab />
      </IonContent>
    </IonPage>
  );
}

export default HistoryPage;