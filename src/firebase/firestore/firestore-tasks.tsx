import {
  collection,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  doc,
  deleteDoc,
  orderBy,
  Timestamp,
} from "@firebase/firestore";
import { User } from "firebase/auth";
import { Task } from "../../interfaces/tasks";
import { getUser } from "../auth/auth";
import { fs } from "../firebase";
import { saveToStorage } from "../../capacitor/storage";
import { CATEGORIES_STORAGE_KEY } from "../../constants/constants";

////////////////////////////////////////////////////////
/*Functions*/
////////////////////////////////////////////////////////

export async function createTask(
  currentTask: Task,
  loadingFunction: (b: boolean) => void,
  alertFunction: (b: boolean) => void
): Promise<boolean> {
  loadingFunction(true);

  const user: User | null = getUser();
  if (user === null) {
    loadingFunction(false);
    alertFunction(true);
    return false;
  }

  // Retrieve Data from Firestore
  const path = "users/" + user.uid + "/tasks";
  const ref = doc(fs, path, currentTask.id);

  await setDoc(ref, {
    name: currentTask.name,
    categories: currentTask.categories,
    timeframe: currentTask.timeframe,
    notes: currentTask.notes,
    isComplete: currentTask.isComplete,
    timestamp: Timestamp.now(),
  }).catch((reason) => {
    console.log(reason);
    loadingFunction(false);
    alertFunction(true);
    return false;
  });

  // Return
  loadingFunction(false);
  return true;
}

export async function getTasks(): Promise<Task[]> {
  const returnArray = [] as Task[];
  const categoryArray = [] as string[];

  const user: User | null = getUser();
  if (user !== null) {
    // Retrieve Data from Firestore
    const path = "users/" + user.uid + "/tasks";
    const queryRef = query(collection(fs, path));
    const querySnapshot = await getDocs(queryRef);

    // Append Data from Firestore
    querySnapshot.forEach((doc) => {
      let currentItem = doc.data() as Task;
      let timestamp = doc.data().timestamp as Timestamp;
      currentItem.timestamp = timestamp.toDate();
      currentItem.id = doc.id;
      returnArray.push(currentItem);
      categoryArray.push(...currentItem.categories);
    });
  }

  // Return
  saveToStorage<string[]>(CATEGORIES_STORAGE_KEY, categoryArray);
  return returnArray;
}

export async function getTask(id: string): Promise<Task | false> {
  const user: User | null = getUser();
  if (user !== null) {
    // Retrieve Data from Firestore
    const path = "users/" + user.uid + "/tasks/" + id;
    const docRef = doc(fs, path);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const returnTask = docSnapshot.data() as Task;
      let timestamp = docSnapshot.data().timestamp as Timestamp;
      returnTask.timestamp = timestamp.toDate();
      return returnTask;
    } else {
      return false;
    }
  }

  // Return
  return false;
}

export async function getTasksListener(
  taskUpdater: (a: Task[]) => void,
  categoryUpdater: (a: string[]) => void
): Promise<boolean> {
  const user: User | null = getUser();
  if (user !== null) {
    // Retrieve Data from Firestore
    const path = "users/" + user.uid + "/tasks";
    const queryRef = query(collection(fs, path), orderBy("timestamp", "desc"));

    /*const unsubscribe = */
    onSnapshot(queryRef, (querySnapshot) => {
      const returnArrayTask = [] as Task[];
      const uniqueCategories = new Set<string>();
      // Append Data from Firestore
      querySnapshot.forEach((doc) => {
        let currentItem = doc.data() as Task;
        currentItem.id = doc.id;
        let timestamp = doc.data().timestamp as Timestamp;
        currentItem.timestamp = timestamp.toDate();
        returnArrayTask.push(currentItem);
        if (currentItem.categories && !currentItem.isComplete) {
          currentItem.categories.forEach((currentCategory: string) => {
            uniqueCategories.add(currentCategory);
          });
        }
      });
      taskUpdater(returnArrayTask);
      const uniqueCategoryArray = Array.from(uniqueCategories);
      categoryUpdater(uniqueCategoryArray);
      saveToStorage<string[]>(CATEGORIES_STORAGE_KEY, uniqueCategoryArray);
    });

    //Call unsubscribe() to remove listener
    return true;
  }
  return false;
}

export async function deleteTask(
  currentTask: Task,
  loadingFunction: (b: boolean) => void,
  alertFunction: (b: boolean) => void
): Promise<boolean> {
  const user: User | null = getUser();
  if (user === null) {
    loadingFunction(false);
    alertFunction(true);
    return false;
  }

  // Get Ref
  const path = "users/" + user.uid + "/tasks";
  const ref = doc(fs, path, currentTask.id);

  await deleteDoc(ref);

  return true;
}

export async function completeTask(
  currentTask: Task,
  toComplete: boolean,
  loadingFunction: (b: boolean) => void,
  alertFunction: (b: boolean) => void
): Promise<boolean> {
  const user: User | null = getUser();
  if (user === null) {
    loadingFunction(false);
    alertFunction(true);
    return false;
  }

  // Get Ref
  const path = "users/" + user.uid + "/tasks";
  const ref = doc(fs, path, currentTask.id);

  await setDoc(
    ref,
    { isComplete: toComplete, timestamp: Timestamp.now() },
    { merge: true }
  )
    .then(() => {
      return true;
    })
    .catch((reason) => {
      console.log(reason);
      loadingFunction(false);
      alertFunction(true);
      return false;
    });

  return true;
}
