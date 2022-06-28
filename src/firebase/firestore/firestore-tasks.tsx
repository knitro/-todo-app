import { collection, getDoc, getDocs, onSnapshot, query, setDoc, doc, deleteDoc, orderBy, Timestamp } from "@firebase/firestore";
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
    timestamp: Timestamp.now()
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

export async function getTask(id : string) : Promise<Task | false> {

  const user : User | null = getUser()
  if (user !== null) {

    // Retrieve Data from Firestore
    const path = "users/" + user.uid + "/tasks/" + id
    const docRef = doc(fs, path)
    const docSnapshot = await getDoc(docRef)

    if (docSnapshot.exists()) {
      const returnTask = docSnapshot.data() as Task
      return returnTask
    } else {
      return false
    }
  }

  // Return
  return false;
}

export async function getTasksListener(
  taskUpdater : (a: Task[]) => void, categoryUpdater : (a: string[]) => void
) : Promise<boolean> {

  const user : User | null = getUser()
  if (user !== null) {

    // Retrieve Data from Firestore
    const path = "users/" + user.uid + "/tasks"
    const queryRef = query(collection(fs, path), orderBy("timestamp", "desc"))

    /*const unsubscribe = */
    onSnapshot(queryRef, (querySnapshot) => {
      const returnArrayTask = [] as Task[];
      const returnArrayCategory = new Set<string>();
      // Append Data from Firestore
      querySnapshot.forEach((doc) => {
        let currentItem = doc.data() as Task;
        currentItem.id = doc.id;
        returnArrayTask.push(currentItem);
        if (currentItem.categories) {
          currentItem.categories.forEach((currentCategory: string) => {
            returnArrayCategory.add(currentCategory)
          })
        }
      });
      taskUpdater(returnArrayTask)
      categoryUpdater(Array.from(returnArrayCategory))
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

  await setDoc(ref, { isComplete: toComplete, timestamp: Timestamp.now() }, { merge: true })
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