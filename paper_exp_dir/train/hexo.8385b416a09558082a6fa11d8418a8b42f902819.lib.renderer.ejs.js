var ejs = require('ejs'),
extend = require('../extend'),
filter = extend.filter.list(),
_ = require('underscore');

_.each(filter, function(val, key){
ejs.filter[key] = val;
});
