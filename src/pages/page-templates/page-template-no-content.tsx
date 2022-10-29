import { IonPage } from "@ionic/react";
import React from "react";
import Header from "../../components/general/Header/Header";
import "./page-template.css";

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props {
  children: React.ReactNode;
  headerLabel: string;
  backButton?: boolean; // Default is false
}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const PageTemplateNoContent: React.FC<Props> = (props: Props) => {
  ////////////////////////
  // Variables
  ////////////////////////

  const children = props.children;
  const headerLabel = props.headerLabel;
  const backButton = props.backButton ? props.backButton : false;

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <IonPage className="page-template-background">
      <div className="app-bar-header">
        <Header headerLabel={headerLabel} isBackButton={backButton} />
      </div>
      {children}
    </IonPage>
  );
};

export default PageTemplateNoContent;
