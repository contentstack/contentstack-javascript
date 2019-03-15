import * as Utils from "./lib/utils.js";
import storage from 'runtime/localstorage.js';

export function get(key) {
    let data = storage.getItem(key);
    try {
        data = JSON.parse(data);
    } catch (e) {
        return data;
    }
    return data || null;
};

export function set(key, data) {
    try {
        if (typeof data === 'object') {
            console.log("storage", storage)
            storage.setItem(key, JSON.stringify(data));
            //localStorage.setItem("hello", "Smith");            
        } else {
            console.log("else")
            storage.setItem(key, data);
        }
    } catch (error) {   
    } 
};

export function getStorage() {
    return storage || null;
};

export function getKeys() {
    return (storage) ? Object.keys(storage) : [];
};
