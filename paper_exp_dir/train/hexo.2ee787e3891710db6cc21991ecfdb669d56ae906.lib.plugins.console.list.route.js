'use strict';

const archy = require('archy');

function listRoute() {
const routes = this.route.list().sort();
const tree = buildTree(routes);
const nodes = buildNodes(tree);

const s = archy({
label: `Total: ${routes.length}`,
nodes
});

console.log(s);
}

function buildTree(routes) {
const obj = {};
let item, j, lenj, seg, cursor;

for (let i = 0, len = routes.length; i < len; i++) {
