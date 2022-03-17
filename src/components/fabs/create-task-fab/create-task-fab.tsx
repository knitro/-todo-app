import FloatingActionButton from '../floating-action-button';
import { add } from 'ionicons/icons';
import { useHistory } from 'react-router';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {};

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const CreateTaskFab = (props : Props) => {

  ////////////////////////
  /*Variables*/
  ////////////////////////

  //Constants
  const color : string = "primary"

  //Props
  const history = useHistory()

  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <FloatingActionButton
      vertical="center"
      horizontal="end"
      icon={add}
      action={() => history.push("create-task")}
      color={color}
    />
  );

}

export default CreateTaskFab;