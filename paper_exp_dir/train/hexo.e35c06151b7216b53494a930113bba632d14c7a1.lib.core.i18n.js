var _ = require('lodash'),
vsprintf = require('sprintf-js').vsprintf;


var i18n = module.exports = function i18n(options){

this.data = {};


this.options = _.extend({
code: 'default'
}, options);

this.options.code = _getCodeToken(this.options.code);
};

