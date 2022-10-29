import {
  IonContent,
  IonIcon,
  IonLabel,
  IonPage,
  IonTabBar,
  IonTabButton,
  ScrollDetail,
} from "@ionic/react";
import { albums, newspaper } from "ionicons/icons";
import React, { useEffect } from "react";
import Header from "../../components/general/Header/Header";
import "./page-template.css";

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props {
  children: React.ReactNode;
  headerLabel: string;
  backButton?: boolean; // Default is false
  isProfile?: boolean;
}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const PageTemplateDefault: React.FC<Props> = (props: Props) => {
  ////////////////////////
  // Variables
  ////////////////////////

  const children = props.children;
  const headerLabel = props.headerLabel;
  const backButton = props.backButton ? props.backButton : false;
  const isProfile = props.isProfile ? props.isProfile : false;
  const paddingTopSize = 64;

  const onScroll = (event: CustomEvent<ScrollDetail>) => {
    const scrollAmount = event.detail.scrollTop;
    let newPaddingTopSize = 0;
    if (scrollAmount <= paddingTopSize) {
      newPaddingTopSize = paddingTopSize - scrollAmount;
    }
    const headerObject = document.getElementById("app-bar-header");
    if (headerObject) {
      headerObject.style.paddingTop = newPaddingTopSize + "px";
    }
  };

  useEffect(() => {
    const headerObject = document.getElementById("app-bar-header");
    if (headerObject) {
      headerObject.style.paddingTop = paddingTopSize + "px";
    }
  });

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <IonPage className="page-template-background">
      <div id="app-bar-header">
        <Header
          headerLabel={headerLabel}
          isBackButton={backButton}
          isProfile={isProfile}
        />
      </div>
      <IonContent
        className="page-template-transparent"
        scrollEvents
        onIonScroll={onScroll}
      >
        {children}
      </IonContent>
      <IonTabBar slot="bottom">
        <IonTabButton tab="tasks" href="/tasks">
          <IonIcon icon={newspaper} />
          <IonLabel>Tasks</IonLabel>
        </IonTabButton>
        <IonTabButton tab="history" href="/history">
          <IonIcon icon={albums} />
          <IonLabel>History</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonPage>
  );
};

export default PageTemplateDefault;
