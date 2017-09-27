import ES6Promise from 'es6-promise';
import fetch from 'isomorphic-fetch';

ES6Promise.polyfill();

export default fetch;