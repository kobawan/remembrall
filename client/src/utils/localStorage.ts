export enum StorageKeys {
	UserId = "UserId",
}

type StorageKeysType = string;

export const storageKeysToDefaultMap: { [key in StorageKeys]: StorageKeysType } = {
	[StorageKeys.UserId]: "",
};

export const getStorageKey = (key: StorageKeys): StorageKeysType => {
	try {
		const value = window.localStorage.getItem(key);
		if (value === null) {
			throw Error;
		}
		return JSON.parse(value);
	} catch {
		return storageKeysToDefaultMap[key];
	}
};

export const setStorageKey = (key: StorageKeys, value: StorageKeysType) => {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	} catch {
		console.error("Not possible to set item", key, "in local storage");
	}
};
