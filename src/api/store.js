import {StoreSubKey} from '../consts.js';

export default class Store {
  constructor(key, storage) {
    this._storage = storage;
    this._storeKey = key;
  }

  getItems(storeSubKey) {
    const storeKey = this._getStoreKey(storeSubKey);

    try {
      return JSON.parse(this._storage.getItem(storeKey));
    } catch (err) {
      return {};
    }
  }

  setItems(storeSubKey, items) {
    const storeKey = this._getStoreKey(storeSubKey);

    this._storage.setItem(
        storeKey,
        JSON.stringify(items)
    );
  }

  setItem(storeSubKey, key, value) {
    const storeKey = this._getStoreKey(storeSubKey);
    const store = this.getItems(storeSubKey);

    this._storage.setItem(
        storeKey,
        JSON.stringify(
            Object.assign({}, store, {
              [key]: value
            })
        )
    );
  }

  _getStoreKey(storeSubKey) {
    if (!storeSubKey) {
      throw new Error(`storeSubKey should not be empty`);
    }

    if (!Object.values(StoreSubKey).includes(storeSubKey)) {
      throw new Error(`unknown storeSubKey: ${storeSubKey}`);
    }

    return `${this._storeKey}-${storeSubKey}`;
  }

  removeItem(storeSubKey, key) {
    const storeKey = this._getStoreKey(storeSubKey);
    const store = this.getItems(storeSubKey);

    delete store[key];

    this._storage.setItem(
        storeKey,
        JSON.stringify(store)
    );
  }
}
