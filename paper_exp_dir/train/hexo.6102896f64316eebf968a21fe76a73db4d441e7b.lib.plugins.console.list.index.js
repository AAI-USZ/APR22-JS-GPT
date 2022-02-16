'use strict';

var store = {
page: require('./page'),
post: require('./post'),
route: require('./route'),
tag: require('./tag'),
category: require('./category'),

cate: require('./category')
};

function listConsole(args){

var type = args._.shift();
var self = this;


