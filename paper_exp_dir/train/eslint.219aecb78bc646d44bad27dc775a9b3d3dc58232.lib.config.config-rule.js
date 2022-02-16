

"use strict";





const builtInRules = require("../rules");






function explodeArray(xs) {
return xs.reduce((accumulator, x) => {
accumulator.push([x]);
return accumulator;
}, []);
}


function combineArrays(arr1, arr2) {
const res = [];

if (arr1.length === 0) {
return explodeArray(arr2);
}
if (arr2.length === 0) {
return explodeArray(arr1);
}
arr1.forEach(x1 => {
arr2.forEach(x2 => {
res.push([].concat(x1, x2));
});
});
return res;
}


function groupByProperty(objects) {
const groupedObj = objects.reduce((accumulator, obj) => {
const prop = Object.keys(obj)[0];

accumulator[prop] = accumulator[prop] ? accumulator[prop].concat(obj) : [obj];
return accumulator;
}, {});

return Object.keys(groupedObj).map(prop => groupedObj[prop]);
}












function combinePropertyObjects(objArr1, objArr2) {
const res = [];

if (objArr1.length === 0) {
return objArr2;
}
if (objArr2.length === 0) {
return objArr1;
}
objArr1.forEach(obj1 => {
objArr2.forEach(obj2 => {
const combinedObj = {};
const obj1Props = Object.keys(obj1);
const obj2Props = Object.keys(obj2);

obj1Props.forEach(prop1 => {
combinedObj[prop1] = obj1[prop1];
});
obj2Props.forEach(prop2 => {
combinedObj[prop2] = obj2[prop2];
});
res.push(combinedObj);
});
});
return res;
}


class RuleConfigSet {


constructor(configs) {


this.ruleConfigs = configs || [];
}


addErrorSeverity() {
const severity = 2;

this.ruleConfigs = this.ruleConfigs.map(config => {
config.unshift(severity);
return config;
});


this.ruleConfigs.unshift(severity);
}


addEnums(enums) {
this.ruleConfigs = this.ruleConfigs.concat(combineArrays(this.ruleConfigs, enums));
}


addObject(obj) {
const objectConfigSet = {
objectConfigs: [],
add(property, values) {
for (let idx = 0; idx < values.length; idx++) {
const optionObj = {};

optionObj[property] = values[idx];
this.objectConfigs.push(optionObj);
}
},

combine() {
this.objectConfigs = groupByProperty(this.objectConfigs).reduce((accumulator, objArr) => combinePropertyObjects(accumulator, objArr), []);
}
};


Object.keys(obj.properties).forEach(prop => {
if (obj.properties[prop].enum) {
objectConfigSet.add(prop, obj.properties[prop].enum);
}
if (obj.properties[prop].type && obj.properties[prop].type === "boolean") {
objectConfigSet.add(prop, [true, false]);
}
});
objectConfigSet.combine();

if (objectConfigSet.objectConfigs.length > 0) {
this.ruleConfigs = this.ruleConfigs.concat(combineArrays(this.ruleConfigs, objectConfigSet.objectConfigs));
return true;
}

return false;
}
}


function generateConfigsFromSchema(schema) {
const configSet = new RuleConfigSet();

if (Array.isArray(schema)) {
for (const opt of schema) {
if (opt.enum) {
configSet.addEnums(opt.enum);
} else if (opt.type && opt.type === "object") {
if (!configSet.addObject(opt)) {
break;
}


} else {


break;
}
}
}
configSet.addErrorSeverity();
return configSet.ruleConfigs;
}


function createCoreRuleConfigs(noDeprecated = false) {
return Array.from(builtInRules).reduce((accumulator, [id, rule]) => {
const schema = (typeof rule === "function") ? rule.schema : rule.meta.schema;
const isDeprecated = (typeof rule === "function") ? rule.deprecated : rule.meta.deprecated;

if (noDeprecated && isDeprecated) {
return accumulator;
}

accumulator[id] = generateConfigsFromSchema(schema);
return accumulator;
}, {});
}






module.exports = {
generateConfigsFromSchema,
createCoreRuleConfigs
};
