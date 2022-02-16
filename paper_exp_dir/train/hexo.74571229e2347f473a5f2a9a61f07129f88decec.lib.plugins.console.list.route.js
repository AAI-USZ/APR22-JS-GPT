'use strict';

var archy = require('archy');

function listRoute(){

var routes = this.route.list().sort();
var tree = buildTree(routes);
var nodes = buildNodes(tree);

var s = archy({
