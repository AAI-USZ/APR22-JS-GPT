var swig = require('swig'),
extend = require('../extend');

swig.init({
filter: extend.filter.list()
});

