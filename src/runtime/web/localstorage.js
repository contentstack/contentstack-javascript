let webLocalStoreage = function (){
    try {
        var storage = window.localStorage
        return storage;
    } catch(e) {
        return null
    }
};

export default webLocalStoreage();
