var extend = require('./extend'),
generate = extend.generate.list(),
process = extend.process.list(),
theme = require('./theme'),
Collection = require('./model').Collection,
Taxonomy = require('./model').Taxonomy,
async = require('async');

var site = {
posts: new Collection(),
pages: new Collection(),
categories: new Taxonomy(),
tags: new Taxonomy()
};
