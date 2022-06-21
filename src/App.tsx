////////////////////////////////////////////////////////////////////////////////////
/*React Imports*/
////////////////////////////////////////////////////////////////////////////////////

import { IonApp, setupIonicReact } from '@ionic/react';
import AppRouter from './AppRouter';

////////////////////////////////////////////////////////////////////////////////////
/*Ionic Imports*/
////////////////////////////////////////////////////////////////////////////////////

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';

import 'firebaseui/dist/firebaseui.css' // Forces "Current Google Android Standards".
                                        // Note that if this is not here (as per firebaseui v6.0.0),
                                        // css for entire app will be converted to this css if the 
                                        // LoginButtons component is rendered.

////////////////////////////////////////////////////////////////////////////////////
/*App Setup */
////////////////////////////////////////////////////////////////////////////////////

setupIonicReact();

const App: React.FC = () => (
  <IonApp>
    <AppRouter />
  </IonApp>
);

export default App;
