import React from "react";
import { IonReactRouter } from '@ionic/react-router';
import { IonRouterOutlet } from '@ionic/react';
import { Redirect, Route } from "react-router-dom";
import CreateTaskPage from "./pages/create-task/create-task-page";
import TasksPage from "./pages/tasks/tasks-page";
import SplashPage from "./pages/splash/splash-page";
import HistoryPage from "./pages/history/history-page";
import SettingsPage from "./pages/settings/settings-page";
import EditTaskPage from "./pages/edit-task/edit-task-page";

const AppRouter : React.FC = () => {

  return (
    <IonReactRouter>
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
          <Route exact path="/edit" component={EditTaskPage} />
          <Route path="/edit/:id" component={EditTaskPage} />
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
    </IonReactRouter>
  );
}

export default AppRouter;