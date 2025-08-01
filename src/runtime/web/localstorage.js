// export default window.localStorage;

const webLocalStorage = function () {
  try {
    const storage = window.localStorage;
    return storage;
  } catch (e) {
    return null;
  }
};

export default webLocalStorage();
