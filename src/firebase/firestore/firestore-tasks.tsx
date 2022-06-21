import { collection, getDocs, onSnapshot, query, setDoc, doc, deleteDoc } from "@firebase/firestore";
import { User } from "firebase/auth";
import { Task } from "../../interfaces/tasks"
import { getUser } from "../auth/auth"
import { fs } from "../firebase"

////////////////////////////////////////////////////////
/*Functions*/
////////////////////////////////////////////////////////

export async function createTask(currentTask : Task, 
    loadingFunction : (b : boolean) => void, alertFunction : (b : boolean) => void
) : Promise<boolean> {

  loadingFunction(true)

  const user : User | null = getUser()
  if (user === null) {
    loadingFunction(false)
    alertFunction(true)
    return false;
  }

  // Retrieve Data from Firestore
  const path = "users/" + user.uid + "/tasks"
  const ref = doc(fs, path, currentTask.id)

  await setDoc(ref, {
    name : currentTask.name,
    categories : currentTask.categories,
    timeframe : currentTask.timeframe,
    notes : currentTask.notes,
    isComplete: currentTask.isComplete,
  }).catch((reason) => {
    console.log(reason)
    loadingFunction(false)
    alertFunction(true)
    return false;
  });

  // Return
  loadingFunction(false)
  return true;
}

export async function getTasks() : Promise<Task[]> {

  const returnArray = [] as Task[];

  const user : User | null = getUser()
  if (user !== null) {

    // Retrieve Data from Firestore
    const path = "users/" + user.uid + "/tasks"
    const queryRef = query(collection(fs, path))
    const querySnapshot = await getDocs(queryRef)

    // Append Data from Firestore
    querySnapshot.forEach((doc) => {
      let currentItem = doc.data() as Task;
      currentItem.id = doc.id;
      returnArray.push(currentItem);
    });
  }

  // Return
  return returnArray;
}

export async function getTasksListener(updater : (a: Task[]) => void) : Promise<boolean> {

  console.log("Setting Up")

  const user : User | null = getUser()
  if (user !== null) {

    console.log("User is not null")

    // Retrieve Data from Firestore
    const path = "users/" + user.uid + "/tasks"
    const queryRef = query(collection(fs, path))

    /*const unsubscribe = */
    onSnapshot(queryRef, (querySnapshot) => {
      const returnArray = [] as Task[];
      // Append Data from Firestore
      querySnapshot.forEach((doc) => {
        let currentItem = doc.data() as Task;
        currentItem.id = doc.id;
        returnArray.push(currentItem);
      });
      console.log("Called")
      updater(returnArray)
    })

    //Call unsubscribe() to remove listener
    return true;
  }
  return false;
}

export async function deleteTask(currentTask : Task,
    loadingFunction : (b : boolean) => void, alertFunction : (b : boolean) => void
) : Promise<boolean> {

  const user : User | null = getUser()
  if (user === null) {
    loadingFunction(false)
    alertFunction(true)
    return false;
  }

  // Get Ref
  const path = "users/" + user.uid + "/tasks"
  const ref = doc(fs, path, currentTask.id)

  await deleteDoc(ref);

  return true;
}

export async function completeTask(currentTask : Task, toComplete : boolean,
  loadingFunction : (b : boolean) => void, alertFunction : (b : boolean) => void
) : Promise<boolean> {

  const user : User | null = getUser()
  if (user === null) {
    loadingFunction(false)
    alertFunction(true)
    return false;
  }

  // Get Ref
  const path = "users/" + user.uid + "/tasks"
  const ref = doc(fs, path, currentTask.id)

  await setDoc(ref, { isComplete: toComplete }, { merge: true })
  .then(() => {
    return true;
  })
  .catch((reason) => {
    console.log(reason)
    loadingFunction(false)
    alertFunction(true)
    return false;
  });

  return true;
}