import { IonAlert, IonLoading } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { RouteComponentProps, useHistory } from "react-router";
import { getTask } from "../../firebase/firestore/firestore-tasks";
import { Task } from "../../interfaces/tasks";
import TaskFormPage from "../task-form/task-form";

////////////////////////////////////////////////////////
/*Props*/
////////////////////////////////////////////////////////

interface Props extends RouteComponentProps<{
  id: string;
}>{}

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const EditTaskPage : React.FC<Props> = (props : Props) => {

  ////////////////////////
  // Constants
  ////////////////////////

  const id = props.match.params.id

  ////////////////////////
  // Return
  ////////////////////////

  return (
    <TaskFormPage id={id}/>
  );
}

export default EditTaskPage;
