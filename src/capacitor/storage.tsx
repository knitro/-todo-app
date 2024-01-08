import { Preferences } from "@capacitor/preferences";

/**
 * Saves Info into Browser Storage in a JSON string
 * @param key - the key to store the info at
 * @param info - the info to store
 */
export async function saveToStorage<T>(key: string, info: T) {
  const valueToSave: string = JSON.stringify(info);
  await Preferences.set({
    key: key,
    value: valueToSave,
  });
}

/**
 * Gets the stored info from Browser Storage.
 * @param key - the key that the info was stored at
 * @returns the instance as a T if the value is non-null, otherwise null
 */
export async function getFromStorage<T>(key: string): Promise<T | null> {
  const getResult = await Preferences.get({ key: key });
  const storedJsonString = getResult.value;
  if (storedJsonString === null) {
    return null;
  }
  const parsedStore = JSON.parse(storedJsonString);
  return parsedStore as T;
}

export function clearKeyFromStorage(key: string) {
  localStorage.removeItem(key);
}
