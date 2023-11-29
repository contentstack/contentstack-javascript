import * as Utils from '../lib/utils';


export default class Taxonomies {
  constructor() {
    this._query = {};
    return this;
  }

  toJSON() {
    this.toJSON = true;
    return this;
  }
}