import { mmkvStorage } from "../mmkvInstance";

export const saveData = async (key: string, value: any) => {
  try {
    await mmkvStorage.setString(key, JSON.stringify(value));
  } catch (error) {
    console.error('Failed to save data:', error);
  }
};

export const getData = async (key: string) => {
  try {
    const data = await mmkvStorage.getString(key);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to retrieve data:', error);
    return null;
  }
};

export const removeData = async (key: string) => {
  try {
    await mmkvStorage.removeItem(key);
  } catch (error) {
    console.error('Failed to remove data:', error);
  }
};
