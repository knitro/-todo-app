import { IonContent } from "@ionic/react";
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

const HomePage : React.FC<Props> = (props : Props) => {

  ////////////////////////
  // Variables
  ////////////////////////

  // Nothing

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <>
      <Header headerLabel="To Do"/>
      <IonContent>
        <CreateTaskFab />
      </IonContent>
    </>
  );
}

export default HomePage;