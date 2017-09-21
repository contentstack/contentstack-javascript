/**
 * @method spread
 * @description return the promise with the arguments.
 * @example
 * blogQuery.find().spread()
 */
function spread() {
    if (Promise.prototype.spread) return;
    Promise.prototype.spread = function (fn) {
        return this.then(function (args) {
            return fn.apply(fn, args);
        });
    };
}
if (typeof Promise !== 'undefined') {
    spread();
}
export default fetch;

