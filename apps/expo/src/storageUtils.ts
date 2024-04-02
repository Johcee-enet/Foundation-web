import { MMKV } from "react-native-mmkv";
import { Env } from "@env";

export const storage = new MMKV({
  id: "enet-miner-app",
  encryptionKey: Env.LOCAL_STORE_ENC_KEY,
});

export const storeData = (key: string, value: any): void => {
  try {
    storage.set(key, JSON.stringify(value));
  } catch (e: any) {
    console.log(e, ":::Error storing data");
    throw new Error("Error saving data to local storage");
  }
};

export const getData = (
  key: string,
  shouldParse?: boolean,
): Record<string, any> | string | null => {
  try {
    const value = storage.getString(key);
    return shouldParse && value ? JSON.parse(value) : value;
  } catch (e: any) {
    console.log(e, ":::Error reading data");
    throw new Error(e.message ?? e.toString());
  }
};

export const removeData = (key: string): void => {
  try {
    storage.delete(key);
  } catch (e: any) {
    console.log(e.message ?? e.tostring(), ":::Error removing item");
    throw new Error(e.message ?? e.tostring());
  }
};
