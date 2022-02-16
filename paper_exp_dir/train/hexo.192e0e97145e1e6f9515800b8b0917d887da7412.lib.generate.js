var extend = require('./extend'),
generate = extend.generate.list(),
process = extend.process.list(),
theme = require('./theme'),
async = require('async');

var site = {
posts: new Posts(),
pages: new Posts(),
categories: {},
tags: {}
};

