// export default window.localStorage;

let webLocalStorage = function (){
    try {
        var storage = window.localStorage
        return storage;
    } catch(e) {
        return null
    }
};

export default webLocalStorage();
    