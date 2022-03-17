import { collection, getDocs, query, setDoc, doc } from "@firebase/firestore";
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
    category : currentTask.category,
    colour : currentTask.colour,
    notes : currentTask.notes,
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