import React from "react";
import { IonReactRouter } from '@ionic/react-router';
import { IonIcon, IonLabel, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Redirect, Route } from "react-router-dom";
import CreateTaskPage from "./pages/create-task/create-task-page";
import TasksPage from "./pages/tasks/tasks-page";
import HomePage from "./pages/home/home-page";
import { home, newspaper } from "ionicons/icons";
import SplashPage from "./pages/splash/splash-page";

const AppRouter : React.FC = () => {
  return (
    <IonReactRouter>
      <IonTabs>

        <IonRouterOutlet>
          <Route exact path="/login">
            <SplashPage />
          </Route>
          <Route exact path="/home">
            <HomePage />
          </Route>
          <Route exact path="/tasks">
            <TasksPage />
          </Route>
          <Route path="/create-task">
            <CreateTaskPage />
          </Route>
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
        
        <IonTabBar slot="bottom">
          <IonTabButton tab="home" href="/home">
            <IonIcon icon={home} />
            <IonLabel>Home</IonLabel>
          </IonTabButton>
          <IonTabButton tab="tasks" href="/tasks">
            <IonIcon icon={newspaper} />
            <IonLabel>Tasks</IonLabel>
          </IonTabButton>
        </IonTabBar>

      </IonTabs>
    </IonReactRouter>
  );
}

export default AppRouter;