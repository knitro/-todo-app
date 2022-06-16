import FloatingActionButton from '../floating-action-button';
import { arrowBack } from 'ionicons/icons';
import { useHistory } from 'react-router';

////////////////////////////////////////////////////////
/*Props and State*/
////////////////////////////////////////////////////////

interface Props {};

////////////////////////////////////////////////////////
/*Component*/
////////////////////////////////////////////////////////

const BackFab = (props : Props) => {

  ////////////////////////
  /*Variables*/
  ////////////////////////

  //Constants
  const color : string = "contrast"

  //Props
  const history = useHistory()

  ////////////////////////
  /*Return*/
  ////////////////////////

  return (
    <FloatingActionButton
      vertical="top"
      horizontal="start"
      icon={arrowBack}
      action={() => history.goBack()}
      color={color}
    />
  );

}

export default BackFab;