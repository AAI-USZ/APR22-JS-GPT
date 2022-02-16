'use strict';

var abbrev = require('abbrev');

var store = {
page: require('./page'),
post: require('./post'),
route: require('./route'),
tag: require('./tag'),
category: require('./category')
};

var alias = abbrev(Object.keys(store));

