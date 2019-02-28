// export default window.localStorage;

let webLocalStoreage = function (){
    try {
        var storage = window.localStorage,
            x = '__storage_test__';
        storage.setItem(x, x);
        storage.removeItem(x);
        return window[type];
    } catch(e) {
        return null
    }
};

export default webLocalStoreage
    