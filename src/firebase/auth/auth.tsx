import { User, signOut, OAuthProvider, signInWithRedirect, GoogleAuthProvider, AuthProvider, getRedirectResult } from "firebase/auth";
import { Timestamp } from "firebase/firestore";
import { auth } from "../firebase";

////////////////////////////////////////////////////////
/*Initialisation*/
////////////////////////////////////////////////////////

const providerGoogle = new GoogleAuthProvider();
const providerApple = new OAuthProvider('apple.com');

////////////////////////////////////////////////////////
/*Account Functions*/
////////////////////////////////////////////////////////

// NOTE:
// Until the package below has firebase v9 support, logging in will not work except for the web platform
// https://github.com/baumblatt/capacitor-firebase-auth/tree/next

/**
 * Signs in with the provider given as the parameter.
 * @param provider - the provider that the authentication will go through.
 * This must be enabled through the Firebase console first before being implemented with code.
 * @returns true if login was successful, otherwise false
 */
export async function signIn(provider : AuthProvider) : Promise<boolean>{
  // const result = await signInWithPopup(auth, provider)
  await signInWithRedirect(auth, provider)
  const result = await getRedirectResult(auth)
  if (result) {
    return true;
  } else {
    return false
  }
}

/**
 * Signs in using Google as the Authentication service
 * @returns true if login was successful, otherwise false
 */
export async function signInWithGoogle() : Promise<boolean> {
  return await signIn(providerGoogle);
  // cfaSignIn('google.com')
  // return true
}

/**
 * Signs in using Apple as the Authentication service
 * SETUP REQUIRED!
 * Apple Sign In Docs: https://firebase.google.com/docs/auth/web/apple
 * @returns true if login was successful, otherwise false
 */
export async function signInWithApple() : Promise<boolean> {
  return await signIn(providerApple);
}

/**
 * Signs out the current user from Firebase Authentication.
 * @returns 
 */
 export async function doSignOut() : Promise<void> {
  signOut(auth).then( () => {
    return;
  }).catch( (error) => {
    console.log(error)
    return;
  });
}

////////////////////////////////////////////////////////
/*Getter Functions*/
////////////////////////////////////////////////////////

/**
 * Returns the current Time+Date
 * @returns the Date
 */
export function getDate() : Timestamp {
  return Timestamp.now()
} 

/**
 * Returns the Current Logged in User.
 * @returns the user, or null if there is no logged in user.
 */
export function getUser() : User | null {
  return auth.currentUser
} 

/**
 * Returns a boolean whether the user is logged in or not.
 * This check is auth.currentUser === null.
 * @returns true if there is a user logged in, otherwise false.
 */
export function isLoggedIn() : boolean {
  return (auth.currentUser !== null)
}