var extend = require('./extend'),
generate = extend.generate.list(),
process = extend.process.list(),
async = require('async');

var site = {
posts: new Posts(),
pages: new Posts(),
categories: {},
tags: {}
};

function Posts(arr){
