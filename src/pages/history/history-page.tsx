import { IonContent, IonPage } from "@ionic/react";
import React from "react";
import CreateTaskFab from "../../components/fabs/create-task-fab/create-task-fab";
import Header from "../../components/general/Header/Header";
import PageTemplateDefault from "../page-templates/page-template-default";

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
    <PageTemplateDefault headerLabel="History">
    </PageTemplateDefault>
  );
}

export default HistoryPage;