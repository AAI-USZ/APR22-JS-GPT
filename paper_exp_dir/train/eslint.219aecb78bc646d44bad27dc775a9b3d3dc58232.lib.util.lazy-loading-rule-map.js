
"use strict";

const debug = require("debug")("eslint:rules");




class LazyLoadingRuleMap extends Map {


constructor(loaders) {
let remaining = loaders.length;

super(
debug.enabled
? loaders.map(([ruleId, load]) => {
let cache = null;

return [
ruleId,
() => {
if (!cache) {
debug("Loading rule %o (remaining=%d)", ruleId, --remaining);
cache = load();
}
return cache;
}
];
})
: loaders
);


Object.defineProperty(LazyLoadingRuleMap.prototype, "set", {
configurable: true,
value: void 0
});
}


get(ruleId) {
const load = super.get(ruleId);

return load && load();
}


*values() {
for (const load of super.values()) {
yield load();
}
}


*entries() {
for (const [ruleId, load] of super.entries()) {
yield [ruleId, load()];
}
}


forEach(callbackFn, thisArg) {
for (const [ruleId, load] of super.entries()) {
callbackFn.call(thisArg, load(), ruleId, this);
}
}
}


Object.defineProperties(LazyLoadingRuleMap.prototype, {
clear: { configurable: true, value: void 0 },
delete: { configurable: true, value: void 0 },
[Symbol.iterator]: {
configurable: true,
writable: true,
value: LazyLoadingRuleMap.prototype.entries
}
});

module.exports = { LazyLoadingRuleMap };
