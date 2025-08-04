import Query from './query';

// Overrideing compare function to include level
const _extend = {
  compare: function (type) {
    return function (key, value, levels) {
      if (key && value && typeof key === 'string' && typeof value !== 'undefined') {
        this._query.query[key] = this._query.query.file_size || {};
        this._query.query[key][type] = value;
        if (levels && typeof levels === 'number') {
          this._query.query[key].levels = levels;
        }
        return this;
      } else {
        if (this.fetchOptions.debug) this.fetchOptions.logHandler('error', 'Kindly provide valid parameters.');
      }
    };
  }
};

export default class Taxonomy extends Query {
  constructor () {
    super();
    /**
     * @method above
     * @memberOf Query
     * @description Get all entries for a specific taxonomy that match only the parent term(s) of a specified target term, excluding the target term itself. You can also specify a specific level.
     * @param {String} key - uid of the taxonomy, specified as `taxonomies.<taxonomy_uid>`
     * @param {*} value - uid of the term to be matched
     * @example For taxonomy_uid = taxonomy1, and term_uid = term1
     * let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.above("taxonomies.taxonomy1", "term1").toJSON().find() // without levels
     *          let data = blogQuery.above("taxonomies.taxonomy1", "term1", 4).toJSON().find() // with levels
     *          data.then(function (result) {
     *          // result = the data which matches only the parent term(s) of the specified term, excluding the term itself
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     * @instance
     */
    this.above = _extend.compare('$above');

    /**
     * @method equalAndAbove
     * @memberOf Query
     * @description Get all entries for a specific taxonomy that match a specific term and all its ancestor terms, requiring only the target term and a specified level.
     * @param {String} key - uid of the taxonomy, specified as `taxonomies.<taxonomy_uid>`
     * @param {*} value - uid of the term to be matched
     * @example For taxonomy_uid = taxonomy1, and term_uid = term1
     * let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.equalAndAbove("taxonomies.taxonomy1", "term1").toJSON().find() // without levels
     *          let data = blogQuery.equalAndAbove("taxonomies.taxonomy1", "term1", 4).toJSON().find() // with levels
     *          data.then(function (result) {
     *          // result = the data which matches a specific term and all its ancestor terms
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     * @instance
     */
    this.equalAndAbove = _extend.compare('$eq_above');

    /**
     * @method below
     * @memberOf Query
     * @description Get all entries for a specific taxonomy that match all of their descendant terms by specifying only the target term and a specific level.
     * @param {String} key - uid of the taxonomy, specified as `taxonomies.<taxonomy_uid>`
     * @param {*} value - uid of the term to be matched
     * @example For taxonomy_uid = taxonomy1, and term_uid = term1
     * let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.below("taxonomies.taxonomy1", "term1").toJSON().find() // without levels
     *          let data = blogQuery.below("taxonomies.taxonomy1", "term1", 4).toJSON().find() // with levels
     *          data.then(function (result) {
     *          // result = the data which matches all of the descendant terms.
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     * @instance
     */
    this.below = _extend.compare('$below');

    /**
     * @method equalAndBelow
     * @memberOf Query
     * @description Get all entries for a specific taxonomy that match a specific term and all its descendant terms, requiring only the target term and a specified level.
     * @param {String} key - uid of the taxonomy, specified as `taxonomies.<taxonomy_uid>`
     * @param {*} value - uid of the term to be matched
     * @example For taxonomy_uid = taxonomy1, and term_uid = term1
     * let blogQuery = Stack().ContentType('example').Query();
     *          let data = blogQuery.equalAndBelow("taxonomies.taxonomy1", "term1").toJSON().find() // without levels
     *          let data = blogQuery.equalAndBelow("taxonomies.taxonomy1", "term1", 4).toJSON().find() // with levels
     *          data.then(function (result) {
     *          // result = the data which matches a specific term and all its descendant terms.
     *       },function (error) {
     *          // error function
     *      })
     * @returns {Query}
     * @instance
     */
    this.equalAndBelow = _extend.compare('$eq_below');
  }
}
