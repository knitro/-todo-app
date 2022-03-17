import { FirebaseApp, initializeApp } from "firebase/app"
import { firebaseConfig } from "../apikeys/apikeys";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

////////////////////////////////////////////////////////
/*Initialisation*/
////////////////////////////////////////////////////////

const firebaseApp : FirebaseApp = initializeApp(firebaseConfig);

////////////////////////////////////////////////////////
/*Exports*/
////////////////////////////////////////////////////////

export const auth = getAuth(firebaseApp)
export const fs = getFirestore(firebaseApp)
