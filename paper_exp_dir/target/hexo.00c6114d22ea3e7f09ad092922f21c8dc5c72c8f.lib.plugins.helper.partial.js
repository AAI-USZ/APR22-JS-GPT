
module.exports = ctx => function partial(name, locals, options = {}) {
if (typeof name !== 'string') throw new TypeError('name must be a string!');
