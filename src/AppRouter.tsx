import React, { useState } from "react";
import { IonReactRouter } from '@ionic/react-router';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Redirect, Route } from "react-router-dom";
import CreateTaskPage from "./pages/create-task/create-task-page";
import TasksPage from "./pages/tasks/tasks-page";
import { albums, newspaper } from "ionicons/icons";
import SplashPage from "./pages/splash/splash-page";
import HistoryPage from "./pages/history/history-page";
import SettingsPage from "./pages/settings/settings-page";
import { auth } from "./firebase/firebase";

const AppRouter : React.FC = () => {

  const [isLoggedIn, setLoggedIn] = useState(false)
  auth.onAuthStateChanged(function(user) {
    if (user) {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }
  });

  return (
    <IonReactRouter>
      <IonTabs>
        <IonRouterOutlet>
          <Route exact path="/login">
            <SplashPage />
          </Route>
          <Route exact path="/tasks">
            <TasksPage />
          </Route>
          <Route exact path="/history">
            <HistoryPage/>
          </Route>
          <Route exact path="/settings">
            <SettingsPage/>
          </Route>
          <Route path="/create-task">
            <CreateTaskPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>

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
        
      </IonTabs>
    </IonReactRouter>
  );
}

export default AppRouter;