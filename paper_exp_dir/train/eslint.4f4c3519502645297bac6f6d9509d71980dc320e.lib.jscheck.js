







var astw = require("astw"),
util = require("util"),
esprima = require("esprima"),
rules = require("./rules"),
RuleContext = require("./rule-context"),
EventEmitter = require("events").EventEmitter;





module.exports = (function() {

var api = Object.create(new EventEmitter()),
messages = [],
currentText = null,
currentConfig = null;


api.reset = function() {
this.removeAllListeners();
messages = [];
currentConfig = null;
currentText = null;
};


api.verify = function(text, config, saveState) {

if (!saveState) {
this.reset();
}


Object.keys(config.rules).forEach(function(key) {

var ruleCreator = rules.get(key),
rule;

if (ruleCreator) {
rule = ruleCreator(new RuleContext(key, api));


Object.keys(rule).forEach(function(nodeType) {
api.on(nodeType, rule[nodeType]);
});
} else {
throw new Error("Definition for rule '" + key + "' was not found.");
}
});


currentConfig = config;
currentText = text;


var ast = esprima.parse(text, { loc: true, range: true }),
walk = astw(ast);

walk(function(node) {
api.emit(node.type, node);
});

return messages;
};


api.report = function(ruleId, node, message) {
messages.push({
ruleId: ruleId,
node: node,
message: message
});
};


api.isNodeJS = function() {
return currentConfig.env ? currentConfig.env.nodejs : false;
};


api.getCurrentText = function() {
return currentText;
};


api.getSource = function(node) {
return currentText ? currentText.slice(node.range[0], node.range[1]) : null;
};

return api;

}());
