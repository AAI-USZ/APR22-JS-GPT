
"use strict";





const vk = require("eslint-visitor-keys");
const debug = require("debug")("eslint:traverser");






function noop() {


}


function isNode(x) {
return x !== null && typeof x === "object" && typeof x.type === "string";
}


function getVisitorKeys(visitorKeys, node) {
let keys = visitorKeys[node.type];

if (!keys) {
keys = vk.getKeys(node);
debug("Unknown node type \"%s\": Estimated visitor keys %j", node.type, keys);
}

return keys;
}


class Traverser {
constructor() {
this._current = null;
this._parents = [];
this._skipped = false;
this._broken = false;
this._visitorKeys = null;
this._enter = null;
this._leave = null;
}


current() {
return this._current;
}


parents() {
return this._parents.slice(0);
}


break() {
this._broken = true;
}


skip() {
this._skipped = true;
}


traverse(node, options) {
this._current = null;
this._parents = [];
this._skipped = false;
this._broken = false;
this._visitorKeys = options.visitorKeys || vk.KEYS;
this._enter = options.enter || noop;
this._leave = options.leave || noop;
this._traverse(node, null);
}


_traverse(node, parent) {
if (!isNode(node)) {
return;
}

this._current = node;
this._skipped = false;
this._enter(node, parent);

if (!this._skipped && !this._broken) {
const keys = getVisitorKeys(this._visitorKeys, node);

if (keys.length >= 1) {
this._parents.push(node);
for (let i = 0; i < keys.length && !this._broken; ++i) {
const child = node[keys[i]];

if (Array.isArray(child)) {
for (let j = 0; j < child.length && !this._broken; ++j) {
this._traverse(child[j], node);
}
} else {
this._traverse(child, node);
}
}
this._parents.pop();
}
}

if (!this._broken) {
this._leave(node, parent);
}

this._current = parent;
}


static getKeys(node) {
return vk.getKeys(node);
}


static traverse(node, options) {
new Traverser().traverse(node, options);
}


static get DEFAULT_VISITOR_KEYS() {
return vk.KEYS;
}
}

module.exports = Traverser;
