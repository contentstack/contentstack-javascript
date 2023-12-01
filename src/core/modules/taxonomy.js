import Query from "./query";
import * as Utils from "../lib/utils"

const _extend = Utils._extend

// Overrideing compare function to include level
_extend.compare = function(type) {
  return function(key, value, level=0) {
      if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
          this._query['query'][key] = this._query['query']['file_size'] || {};
          this._query['query'][key][type] = value;
          if (level > 0 && level <= 10) {
            this._query['query'][key]['level'] = level
          }
          return this;
      } else {
          if (this.fetchOptions.debug)  this.fetchOptions.logHandler('error', "Kindly provide valid parameters.");
      }
  };
}

export default class TaxonomyQuery extends Query {
  constructor() {
    super();
    this.above = _extend.compare('$above')
    this.equalAndAbove = _extend.compare('$eq_above')
    this.below = _extend.compare('$below')
    this.equalAndBelow = _extend.compare('$eq_below')
  }
}