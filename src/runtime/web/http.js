import ES6Promise from 'es6-promise';
// import fetch from 'isomorphic-fetch';
ES6Promise.polyfill();

export default fetch; // fetch API available in Node.js 18 and later