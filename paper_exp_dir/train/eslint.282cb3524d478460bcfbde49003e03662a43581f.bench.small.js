



(function(){
var DEBUG=true;
(function(undefined){


var window = this || (0, eval)('this'),
document = window['document'],
navigator = window['navigator'],
jQuery = window["jQuery"],
JSON = window["JSON"];
(function(factory) {

if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {

var target = module['exports'] || exports;
factory(target);
} else if (typeof define === 'function' && define['amd']) {

define(['exports'], factory);
} else {

factory(window['ko'] = {});
}
}(function(koExports){


var ko = typeof koExports !== 'undefined' ? koExports : {};

ko.exportSymbol = function(koPath, object) {
var tokens = koPath.split(".");



var target = ko;

for (var i = 0; i < tokens.length - 1; i++)
target = target[tokens[i]];
target[tokens[tokens.length - 1]] = object;
};
ko.exportProperty = function(owner, publicName, object) {
owner[publicName] = object;
};
ko.version = "3.0.0";

ko.exportSymbol('version', ko.version);
ko.utils = (function () {
var objectForEach = function(obj, action) {
for (var prop in obj) {
if (obj.hasOwnProperty(prop)) {
action(prop, obj[prop]);
}
}
};


var knownEvents = {}, knownEventTypesByEventName = {};
var keyEventTypeName = (navigator && /Firefox\/2/i.test(navigator.userAgent)) ? 'KeyboardEvent' : 'UIEvents';
knownEvents[keyEventTypeName] = ['keyup', 'keydown', 'keypress'];
knownEvents['MouseEvents'] = ['click', 'dblclick', 'mousedown', 'mouseup', 'mousemove', 'mouseover', 'mouseout', 'mouseenter', 'mouseleave'];
objectForEach(knownEvents, function(eventType, knownEventsForType) {
if (knownEventsForType.length) {
for (var i = 0, j = knownEventsForType.length; i < j; i++)
knownEventTypesByEventName[knownEventsForType[i]] = eventType;
}
});
var eventsThatMustBeRegisteredUsingAttachEvent = { 'propertychange': true };





var ieVersion = document && (function() {
var version = 3, div = document.createElement('div'), iElems = div.getElementsByTagName('i');


while (
div.innerHTML = '<!--[if gt IE ' + (++version) + ']><i></i><![endif]-->',
iElems[0]
) {}
return version > 4 ? version : undefined;
}());
var isIe6 = ieVersion === 6,
isIe7 = ieVersion === 7;

function isClickOnCheckableElement(element, eventType) {
if ((ko.utils.tagNameLower(element) !== "input") || !element.type) return false;
if (eventType.toLowerCase() != "click") return false;
var inputType = element.type;
return (inputType == "checkbox") || (inputType == "radio");
}

return {
fieldsIncludedWithJsonPost: ['authenticity_token', /^__RequestVerificationToken(_.*)?$/],

arrayForEach: function (array, action) {
for (var i = 0, j = array.length; i < j; i++)
action(array[i]);
},

arrayIndexOf: function (array, item) {
if (typeof Array.prototype.indexOf == "function")
return Array.prototype.indexOf.call(array, item);
for (var i = 0, j = array.length; i < j; i++)
if (array[i] === item)
return i;
return -1;
},

arrayFirst: function (array, predicate, predicateOwner) {
for (var i = 0, j = array.length; i < j; i++)
if (predicate.call(predicateOwner, array[i]))
return array[i];
return null;
},

arrayRemoveItem: function (array, itemToRemove) {
var index = ko.utils.arrayIndexOf(array, itemToRemove);
if (index >= 0)
array.splice(index, 1);
},

arrayGetDistinctValues: function (array) {
array = array || [];
var result = [];
for (var i = 0, j = array.length; i < j; i++) {
if (ko.utils.arrayIndexOf(result, array[i]) < 0)
result.push(array[i]);
}
return result;
},

arrayMap: function (array, mapping) {
array = array || [];
var result = [];
for (var i = 0, j = array.length; i < j; i++)
result.push(mapping(array[i]));
return result;
},

arrayFilter: function (array, predicate) {
array = array || [];
var result = [];
for (var i = 0, j = array.length; i < j; i++)
if (predicate(array[i]))
result.push(array[i]);
return result;
},

arrayPushAll: function (array, valuesToPush) {
if (valuesToPush instanceof Array)
array.push.apply(array, valuesToPush);
else
for (var i = 0, j = valuesToPush.length; i < j; i++)
array.push(valuesToPush[i]);
return array;
},

addOrRemoveItem: function(array, value, included) {
var existingEntryIndex = ko.utils.arrayIndexOf(ko.utils.peekObservable(array), value);
if (existingEntryIndex < 0) {
if (included)
array.push(value);
} else {
if (!included)
array.splice(existingEntryIndex, 1);
}
},

extend: function (target, source) {
if (source) {
for(var prop in source) {
if(source.hasOwnProperty(prop)) {
target[prop] = source[prop];
}
}
}
return target;
},

objectForEach: objectForEach,

objectMap: function(source, mapping) {
if (!source)
return source;
var target = {};
for (var prop in source) {
if (source.hasOwnProperty(prop)) {
target[prop] = mapping(source[prop], prop, source);
}
}
return target;
},

emptyDomNode: function (domNode) {
while (domNode.firstChild) {
ko.removeNode(domNode.firstChild);
}
},

moveCleanedNodesToContainerElement: function(nodes) {


var nodesArray = ko.utils.makeArray(nodes);

var container = document.createElement('div');
for (var i = 0, j = nodesArray.length; i < j; i++) {
container.appendChild(ko.cleanNode(nodesArray[i]));
}
return container;
},

cloneNodes: function (nodesArray, shouldCleanNodes) {
for (var i = 0, j = nodesArray.length, newNodesArray = []; i < j; i++) {
var clonedNode = nodesArray[i].cloneNode(true);
newNodesArray.push(shouldCleanNodes ? ko.cleanNode(clonedNode) : clonedNode);
}
return newNodesArray;
},

setDomNodeChildren: function (domNode, childNodes) {
ko.utils.emptyDomNode(domNode);
if (childNodes) {
for (var i = 0, j = childNodes.length; i < j; i++)
domNode.appendChild(childNodes[i]);
}
},

replaceDomNodes: function (nodeToReplaceOrNodeArray, newNodesArray) {
var nodesToReplaceArray = nodeToReplaceOrNodeArray.nodeType ? [nodeToReplaceOrNodeArray] : nodeToReplaceOrNodeArray;
if (nodesToReplaceArray.length > 0) {
var insertionPoint = nodesToReplaceArray[0];
var parent = insertionPoint.parentNode;
for (var i = 0, j = newNodesArray.length; i < j; i++)
parent.insertBefore(newNodesArray[i], insertionPoint);
for (var i = 0, j = nodesToReplaceArray.length; i < j; i++) {
ko.removeNode(nodesToReplaceArray[i]);
}
}
},

fixUpContinuousNodeArray: function(continuousNodeArray, parentNode) {













if (continuousNodeArray.length) {

parentNode = (parentNode.nodeType === 8 && parentNode.parentNode) || parentNode;


while (continuousNodeArray.length && continuousNodeArray[0].parentNode !== parentNode)
continuousNodeArray.splice(0, 1);


if (continuousNodeArray.length > 1) {
var current = continuousNodeArray[0], last = continuousNodeArray[continuousNodeArray.length - 1];

continuousNodeArray.length = 0;
while (current !== last) {
continuousNodeArray.push(current);
current = current.nextSibling;
if (!current)
return;
}
continuousNodeArray.push(last);
}
}
return continuousNodeArray;
},

setOptionNodeSelectionState: function (optionNode, isSelected) {

if (ieVersion < 7)
optionNode.setAttribute("selected", isSelected);
else
optionNode.selected = isSelected;
},

stringTrim: function (string) {
return string === null || string === undefined ? '' :
string.trim ?
string.trim() :
string.toString().replace(/^[\s\xa0]+|[\s\xa0]+$/g, '');
},

stringTokenize: function (string, delimiter) {
var result = [];
var tokens = (string || "").split(delimiter);
for (var i = 0, j = tokens.length; i < j; i++) {
var trimmed = ko.utils.stringTrim(tokens[i]);
if (trimmed !== "")
result.push(trimmed);
}
return result;
},

stringStartsWith: function (string, startsWith) {
string = string || "";
if (startsWith.length > string.length)
return false;
return string.substring(0, startsWith.length) === startsWith;
},

domNodeIsContainedBy: function (node, containedByNode) {
if (node === containedByNode)
return true;
if (node.nodeType === 11)
return false;
if (containedByNode.contains)
return containedByNode.contains(node.nodeType === 3 ? node.parentNode : node);
if (containedByNode.compareDocumentPosition)
return (containedByNode.compareDocumentPosition(node) & 16) == 16;
while (node && node != containedByNode) {
node = node.parentNode;
}
return !!node;
},

domNodeIsAttachedToDocument: function (node) {
return ko.utils.domNodeIsContainedBy(node, node.ownerDocument.documentElement);
},

anyDomNodeIsAttachedToDocument: function(nodes) {
return !!ko.utils.arrayFirst(nodes, ko.utils.domNodeIsAttachedToDocument);
},

tagNameLower: function(element) {



return element && element.tagName && element.tagName.toLowerCase();
},

registerEventHandler: function (element, eventType, handler) {
var mustUseAttachEvent = ieVersion && eventsThatMustBeRegisteredUsingAttachEvent[eventType];
if (!mustUseAttachEvent && typeof jQuery != "undefined") {
if (isClickOnCheckableElement(element, eventType)) {




var originalHandler = handler;
handler = function(event, eventData) {
var jQuerySuppliedCheckedState = this.checked;
if (eventData)
this.checked = eventData.checkedStateBeforeEvent !== true;
originalHandler.call(this, event);
this.checked = jQuerySuppliedCheckedState;
};
}
jQuery(element)['bind'](eventType, handler);
} else if (!mustUseAttachEvent && typeof element.addEventListener == "function")
element.addEventListener(eventType, handler, false);
else if (typeof element.attachEvent != "undefined") {
var attachEventHandler = function (event) { handler.call(element, event); },
attachEventName = "on" + eventType;
element.attachEvent(attachEventName, attachEventHandler);



ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
element.detachEvent(attachEventName, attachEventHandler);
});
} else
throw new Error("Browser doesn't support addEventListener or attachEvent");
},

triggerEvent: function (element, eventType) {
if (!(element && element.nodeType))
throw new Error("element must be a DOM node when calling triggerEvent");

if (typeof jQuery != "undefined") {
var eventData = [];
if (isClickOnCheckableElement(element, eventType)) {

eventData.push({ checkedStateBeforeEvent: element.checked });
}
jQuery(element)['trigger'](eventType, eventData);
} else if (typeof document.createEvent == "function") {
if (typeof element.dispatchEvent == "function") {
var eventCategory = knownEventTypesByEventName[eventType] || "HTMLEvents";
var event = document.createEvent(eventCategory);
event.initEvent(eventType, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, element);
element.dispatchEvent(event);
}
else
throw new Error("The supplied element doesn't support dispatchEvent");
} else if (typeof element.fireEvent != "undefined") {


if (isClickOnCheckableElement(element, eventType))
element.checked = element.checked !== true;
element.fireEvent("on" + eventType);
}
else
throw new Error("Browser doesn't support triggering events");
},

unwrapObservable: function (value) {
return ko.isObservable(value) ? value() : value;
},

peekObservable: function (value) {
return ko.isObservable(value) ? value.peek() : value;
},

toggleDomNodeCssClass: function (node, classNames, shouldHaveClass) {
if (classNames) {
var cssClassNameRegex = /\S+/g,
currentClassNames = node.className.match(cssClassNameRegex) || [];
ko.utils.arrayForEach(classNames.match(cssClassNameRegex), function(className) {
ko.utils.addOrRemoveItem(currentClassNames, className, shouldHaveClass);
});
node.className = currentClassNames.join(" ");
}
},

setTextContent: function(element, textContent) {
var value = ko.utils.unwrapObservable(textContent);
if ((value === null) || (value === undefined))
value = "";




var innerTextNode = ko.virtualElements.firstChild(element);
if (!innerTextNode || innerTextNode.nodeType != 3 || ko.virtualElements.nextSibling(innerTextNode)) {
ko.virtualElements.setDomNodeChildren(element, [document.createTextNode(value)]);
} else {
innerTextNode.data = value;
}

ko.utils.forceRefresh(element);
},

setElementName: function(element, name) {
element.name = name;




if (ieVersion <= 7) {
try {
element.mergeAttributes(document.createElement("<input name='" + element.name + "'/>"), false);
}
catch(e) {}
}
},

forceRefresh: function(node) {

if (ieVersion >= 9) {

var elem = node.nodeType == 1 ? node : node.parentNode;
if (elem.style)
elem.style.zoom = elem.style.zoom;
}
},

ensureSelectElementIsRenderedCorrectly: function(selectElement) {



if (ieVersion) {
var originalWidth = selectElement.style.width;
selectElement.style.width = 0;
selectElement.style.width = originalWidth;
}
},

range: function (min, max) {
min = ko.utils.unwrapObservable(min);
max = ko.utils.unwrapObservable(max);
var result = [];
for (var i = min; i <= max; i++)
result.push(i);
return result;
},

makeArray: function(arrayLikeObject) {
var result = [];
for (var i = 0, j = arrayLikeObject.length; i < j; i++) {
result.push(arrayLikeObject[i]);
};
return result;
},

isIe6 : isIe6,
isIe7 : isIe7,
ieVersion : ieVersion,

getFormFields: function(form, fieldName) {
var fields = ko.utils.makeArray(form.getElementsByTagName("input")).concat(ko.utils.makeArray(form.getElementsByTagName("textarea")));
var isMatchingField = (typeof fieldName == 'string')
? function(field) { return field.name === fieldName }
: function(field) { return fieldName.test(field.name) };
var matches = [];
for (var i = fields.length - 1; i >= 0; i--) {
if (isMatchingField(fields[i]))
matches.push(fields[i]);
};
return matches;
},

parseJson: function (jsonString) {
if (typeof jsonString == "string") {
jsonString = ko.utils.stringTrim(jsonString);
if (jsonString) {
if (JSON && JSON.parse)
return JSON.parse(jsonString);
return (new Function("return " + jsonString))();
}
}
return null;
},

stringifyJson: function (data, replacer, space) {
if (!JSON || !JSON.stringify)
throw new Error("Cannot find JSON.stringify(). Some browsers (e.g., IE < 8) don't support it natively, but you can overcome this by adding a script reference to json2.js, downloadable from http://www.json.org/json2.js");
return JSON.stringify(ko.utils.unwrapObservable(data), replacer, space);
},

postJson: function (urlOrForm, data, options) {
options = options || {};
var params = options['params'] || {};
var includeFields = options['includeFields'] || this.fieldsIncludedWithJsonPost;
var url = urlOrForm;


if((typeof urlOrForm == 'object') && (ko.utils.tagNameLower(urlOrForm) === "form")) {
var originalForm = urlOrForm;
url = originalForm.action;
for (var i = includeFields.length - 1; i >= 0; i--) {
var fields = ko.utils.getFormFields(originalForm, includeFields[i]);
for (var j = fields.length - 1; j >= 0; j--)
params[fields[j].name] = fields[j].value;
}
}

data = ko.utils.unwrapObservable(data);
var form = document.createElement("form");
form.style.display = "none";
form.action = url;
form.method = "post";
for (var key in data) {

var input = document.createElement("input");
input.name = key;
input.value = ko.utils.stringifyJson(ko.utils.unwrapObservable(data[key]));
form.appendChild(input);
}
objectForEach(params, function(key, value) {
var input = document.createElement("input");
input.name = key;
input.value = value;
form.appendChild(input);
});
document.body.appendChild(form);
options['submitter'] ? options['submitter'](form) : form.submit();
setTimeout(function () { form.parentNode.removeChild(form); }, 0);
}
}
}());

ko.exportSymbol('utils', ko.utils);
ko.exportSymbol('utils.arrayForEach', ko.utils.arrayForEach);
ko.exportSymbol('utils.arrayFirst', ko.utils.arrayFirst);
ko.exportSymbol('utils.arrayFilter', ko.utils.arrayFilter);
ko.exportSymbol('utils.arrayGetDistinctValues', ko.utils.arrayGetDistinctValues);
ko.exportSymbol('utils.arrayIndexOf', ko.utils.arrayIndexOf);
ko.exportSymbol('utils.arrayMap', ko.utils.arrayMap);
ko.exportSymbol('utils.arrayPushAll', ko.utils.arrayPushAll);
ko.exportSymbol('utils.arrayRemoveItem', ko.utils.arrayRemoveItem);
ko.exportSymbol('utils.extend', ko.utils.extend);
ko.exportSymbol('utils.fieldsIncludedWithJsonPost', ko.utils.fieldsIncludedWithJsonPost);
ko.exportSymbol('utils.getFormFields', ko.utils.getFormFields);
ko.exportSymbol('utils.peekObservable', ko.utils.peekObservable);
ko.exportSymbol('utils.postJson', ko.utils.postJson);
ko.exportSymbol('utils.parseJson', ko.utils.parseJson);
ko.exportSymbol('utils.registerEventHandler', ko.utils.registerEventHandler);
ko.exportSymbol('utils.stringifyJson', ko.utils.stringifyJson);
ko.exportSymbol('utils.range', ko.utils.range);
ko.exportSymbol('utils.toggleDomNodeCssClass', ko.utils.toggleDomNodeCssClass);
ko.exportSymbol('utils.triggerEvent', ko.utils.triggerEvent);
ko.exportSymbol('utils.unwrapObservable', ko.utils.unwrapObservable);
ko.exportSymbol('utils.objectForEach', ko.utils.objectForEach);
ko.exportSymbol('utils.addOrRemoveItem', ko.utils.addOrRemoveItem);
ko.exportSymbol('unwrap', ko.utils.unwrapObservable);

if (!Function.prototype['bind']) {


Function.prototype['bind'] = function (object) {
var originalFunction = this, args = Array.prototype.slice.call(arguments), object = args.shift();
return function () {
return originalFunction.apply(object, args.concat(Array.prototype.slice.call(arguments)));
};
};
}

ko.utils.domData = new (function () {
var uniqueId = 0;
var dataStoreKeyExpandoPropertyName = "__ko__" + (new Date).getTime();
var dataStore = {};

function getAll(node, createIfNotFound) {
var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
var hasExistingDataStore = dataStoreKey && (dataStoreKey !== "null") && dataStore[dataStoreKey];
if (!hasExistingDataStore) {
if (!createIfNotFound)
return undefined;
dataStoreKey = node[dataStoreKeyExpandoPropertyName] = "ko" + uniqueId++;
dataStore[dataStoreKey] = {};
}
return dataStore[dataStoreKey];
}

return {
get: function (node, key) {
var allDataForNode = getAll(node, false);
return allDataForNode === undefined ? undefined : allDataForNode[key];
},
set: function (node, key, value) {
if (value === undefined) {

if (getAll(node, false) === undefined)
return;
}
var allDataForNode = getAll(node, true);
allDataForNode[key] = value;
},
clear: function (node) {
var dataStoreKey = node[dataStoreKeyExpandoPropertyName];
if (dataStoreKey) {
delete dataStore[dataStoreKey];
node[dataStoreKeyExpandoPropertyName] = null;
return true;
}
return false;
},

nextKey: function () {
return (uniqueId++) + dataStoreKeyExpandoPropertyName;
}
};
})();

ko.exportSymbol('utils.domData', ko.utils.domData);
ko.exportSymbol('utils.domData.clear', ko.utils.domData.clear);

ko.utils.domNodeDisposal = new (function () {
var domDataKey = ko.utils.domData.nextKey();
var cleanableNodeTypes = { 1: true, 8: true, 9: true };
var cleanableNodeTypesWithDescendants = { 1: true, 9: true };

function getDisposeCallbacksCollection(node, createIfNotFound) {
var allDisposeCallbacks = ko.utils.domData.get(node, domDataKey);
if ((allDisposeCallbacks === undefined) && createIfNotFound) {
allDisposeCallbacks = [];
ko.utils.domData.set(node, domDataKey, allDisposeCallbacks);
}
return allDisposeCallbacks;
}
function destroyCallbacksCollection(node) {
ko.utils.domData.set(node, domDataKey, undefined);
}

function cleanSingleNode(node) {

var callbacks = getDisposeCallbacksCollection(node, false);
if (callbacks) {
callbacks = callbacks.slice(0);
for (var i = 0; i < callbacks.length; i++)
callbacks[i](node);
}


ko.utils.domData.clear(node);




if ((typeof jQuery == "function") && (typeof jQuery['cleanData'] == "function"))
jQuery['cleanData']([node]);



if (cleanableNodeTypesWithDescendants[node.nodeType])
cleanImmediateCommentTypeChildren(node);
}

function cleanImmediateCommentTypeChildren(nodeWithChildren) {
var child, nextChild = nodeWithChildren.firstChild;
while (child = nextChild) {
nextChild = child.nextSibling;
if (child.nodeType === 8)
cleanSingleNode(child);
}
}

return {
addDisposeCallback : function(node, callback) {
if (typeof callback != "function")
throw new Error("Callback must be a function");
getDisposeCallbacksCollection(node, true).push(callback);
},

removeDisposeCallback : function(node, callback) {
var callbacksCollection = getDisposeCallbacksCollection(node, false);
if (callbacksCollection) {
ko.utils.arrayRemoveItem(callbacksCollection, callback);
if (callbacksCollection.length == 0)
destroyCallbacksCollection(node);
}
},

cleanNode : function(node) {

if (cleanableNodeTypes[node.nodeType]) {
cleanSingleNode(node);


if (cleanableNodeTypesWithDescendants[node.nodeType]) {

var descendants = [];
ko.utils.arrayPushAll(descendants, node.getElementsByTagName("*"));
for (var i = 0, j = descendants.length; i < j; i++)
cleanSingleNode(descendants[i]);
}
}
return node;
},

removeNode : function(node) {
ko.cleanNode(node);
if (node.parentNode)
node.parentNode.removeChild(node);
}
}
})();
ko.cleanNode = ko.utils.domNodeDisposal.cleanNode;
ko.removeNode = ko.utils.domNodeDisposal.removeNode;
ko.exportSymbol('cleanNode', ko.cleanNode);
ko.exportSymbol('removeNode', ko.removeNode);
ko.exportSymbol('utils.domNodeDisposal', ko.utils.domNodeDisposal);
ko.exportSymbol('utils.domNodeDisposal.addDisposeCallback', ko.utils.domNodeDisposal.addDisposeCallback);
ko.exportSymbol('utils.domNodeDisposal.removeDisposeCallback', ko.utils.domNodeDisposal.removeDisposeCallback);
(function () {
var leadingCommentRegex = /^(\s*)<!--(.*?)-->/;

function simpleHtmlParse(html) {









var tags = ko.utils.stringTrim(html).toLowerCase(), div = document.createElement("div");


var wrap = tags.match(/^<(thead|tbody|tfoot)/)              && [1, "<table>", "</table>"] ||
!tags.indexOf("<tr")                             && [2, "<table><tbody>", "</tbody></table>"] ||
(!tags.indexOf("<td") || !tags.indexOf("<th"))   && [3, "<table><tbody><tr>", "</tr></tbody></table>"] ||
[0, "", ""];



var markup = "ignored<div>" + wrap[1] + html + wrap[2] + "</div>";
if (typeof window['innerShiv'] == "function") {
div.appendChild(window['innerShiv'](markup));
} else {
div.innerHTML = markup;
}


while (wrap[0]--)
div = div.lastChild;

return ko.utils.makeArray(div.lastChild.childNodes);
}

function jQueryHtmlParse(html) {

if (jQuery['parseHTML']) {
return jQuery['parseHTML'](html) || [];
} else {

var elems = jQuery['clean']([html]);




if (elems && elems[0]) {

var elem = elems[0];
while (elem.parentNode && elem.parentNode.nodeType !== 11  )
elem = elem.parentNode;

if (elem.parentNode)
elem.parentNode.removeChild(elem);
}

return elems;
}
}

ko.utils.parseHtmlFragment = function(html) {
return typeof jQuery != 'undefined' ? jQueryHtmlParse(html)
: simpleHtmlParse(html);
};

ko.utils.setHtml = function(node, html) {
ko.utils.emptyDomNode(node);


html = ko.utils.unwrapObservable(html);

if ((html !== null) && (html !== undefined)) {
if (typeof html != 'string')
html = html.toString();




if (typeof jQuery != 'undefined') {
jQuery(node)['html'](html);
} else {

var parsedNodes = ko.utils.parseHtmlFragment(html);
for (var i = 0; i < parsedNodes.length; i++)
node.appendChild(parsedNodes[i]);
}
}
};
})();

ko.exportSymbol('utils.parseHtmlFragment', ko.utils.parseHtmlFragment);
ko.exportSymbol('utils.setHtml', ko.utils.setHtml);

ko.memoization = (function () {
var memos = {};

function randomMax8HexChars() {
return (((1 + Math.random()) * 0x100000000) | 0).toString(16).substring(1);
}
function generateRandomId() {
return randomMax8HexChars() + randomMax8HexChars();
}
function findMemoNodes(rootNode, appendToArray) {
if (!rootNode)
return;
if (rootNode.nodeType == 8) {
var memoId = ko.memoization.parseMemoText(rootNode.nodeValue);
if (memoId != null)
appendToArray.push({ domNode: rootNode, memoId: memoId });
} else if (rootNode.nodeType == 1) {
for (var i = 0, childNodes = rootNode.childNodes, j = childNodes.length; i < j; i++)
findMemoNodes(childNodes[i], appendToArray);
}
}

return {
memoize: function (callback) {
if (typeof callback != "function")
throw new Error("You can only pass a function to ko.memoization.memoize()");
var memoId = generateRandomId();
memos[memoId] = callback;
return "<!--[ko_memo:" + memoId + "]-->";
},

unmemoize: function (memoId, callbackParams) {
var callback = memos[memoId];
if (callback === undefined)
throw new Error("Couldn't find any memo with ID " + memoId + ". Perhaps it's already been unmemoized.");
try {
callback.apply(null, callbackParams || []);
return true;
}
finally { delete memos[memoId]; }
},

unmemoizeDomNodeAndDescendants: function (domNode, extraCallbackParamsArray) {
var memos = [];
findMemoNodes(domNode, memos);
for (var i = 0, j = memos.length; i < j; i++) {
var node = memos[i].domNode;
var combinedParams = [node];
if (extraCallbackParamsArray)
ko.utils.arrayPushAll(combinedParams, extraCallbackParamsArray);
ko.memoization.unmemoize(memos[i].memoId, combinedParams);
node.nodeValue = "";
if (node.parentNode)
node.parentNode.removeChild(node);
}
},

parseMemoText: function (memoText) {
var match = memoText.match(/^\[ko_memo\:(.*?)\]$/);
return match ? match[1] : null;
}
};
})();

ko.exportSymbol('memoization', ko.memoization);
ko.exportSymbol('memoization.memoize', ko.memoization.memoize);
ko.exportSymbol('memoization.unmemoize', ko.memoization.unmemoize);
ko.exportSymbol('memoization.parseMemoText', ko.memoization.parseMemoText);
ko.exportSymbol('memoization.unmemoizeDomNodeAndDescendants', ko.memoization.unmemoizeDomNodeAndDescendants);
ko.extenders = {
'throttle': function(target, timeout) {




target['throttleEvaluation'] = timeout;



var writeTimeoutInstance = null;
return ko.dependentObservable({
'read': target,
'write': function(value) {
clearTimeout(writeTimeoutInstance);
writeTimeoutInstance = setTimeout(function() {
target(value);
}, timeout);
}
});
},

'notify': function(target, notifyWhen) {
target["equalityComparer"] = notifyWhen == "always" ?
null :
valuesArePrimitiveAndEqual;
}
};

var primitiveTypes = { 'undefined':1, 'boolean':1, 'number':1, 'string':1 };
function valuesArePrimitiveAndEqual(a, b) {
var oldValueIsPrimitive = (a === null) || (typeof(a) in primitiveTypes);
return oldValueIsPrimitive ? (a === b) : false;
}

function applyExtenders(requestedExtenders) {
var target = this;
if (requestedExtenders) {
ko.utils.objectForEach(requestedExtenders, function(key, value) {
var extenderHandler = ko.extenders[key];
if (typeof extenderHandler == 'function') {
target = extenderHandler(target, value) || target;
}
});
}
return target;
}

ko.exportSymbol('extenders', ko.extenders);

ko.subscription = function (target, callback, disposeCallback) {
this.target = target;
this.callback = callback;
this.disposeCallback = disposeCallback;
ko.exportProperty(this, 'dispose', this.dispose);
};
ko.subscription.prototype.dispose = function () {
this.isDisposed = true;
this.disposeCallback();
};

ko.subscribable = function () {
this._subscriptions = {};

ko.utils.extend(this, ko.subscribable['fn']);
ko.exportProperty(this, 'subscribe', this.subscribe);
ko.exportProperty(this, 'extend', this.extend);
ko.exportProperty(this, 'getSubscriptionsCount', this.getSubscriptionsCount);
}

var defaultEvent = "change";

ko.subscribable['fn'] = {
subscribe: function (callback, callbackTarget, event) {
event = event || defaultEvent;
var boundCallback = callbackTarget ? callback.bind(callbackTarget) : callback;

var subscription = new ko.subscription(this, boundCallback, function () {
ko.utils.arrayRemoveItem(this._subscriptions[event], subscription);
}.bind(this));

if (!this._subscriptions[event])
this._subscriptions[event] = [];
this._subscriptions[event].push(subscription);
return subscription;
},

"notifySubscribers": function (valueToNotify, event) {
event = event || defaultEvent;
if (this.hasSubscriptionsForEvent(event)) {
try {
ko.dependencyDetection.begin();
for (var a = this._subscriptions[event].slice(0), i = 0, subscription; subscription = a[i]; ++i) {


if (subscription && (subscription.isDisposed !== true))
subscription.callback(valueToNotify);
}
} finally {
ko.dependencyDetection.end();
}
}
},

hasSubscriptionsForEvent: function(event) {
return this._subscriptions[event] && this._subscriptions[event].length;
},

getSubscriptionsCount: function () {
var total = 0;
ko.utils.objectForEach(this._subscriptions, function(eventName, subscriptions) {
total += subscriptions.length;
});
return total;
},

extend: applyExtenders
};


ko.isSubscribable = function (instance) {
return instance != null && typeof instance.subscribe == "function" && typeof instance["notifySubscribers"] == "function";
};

ko.exportSymbol('subscribable', ko.subscribable);
ko.exportSymbol('isSubscribable', ko.isSubscribable);

ko.dependencyDetection = (function () {
var _frames = [];

return {
begin: function (callback) {
_frames.push(callback && { callback: callback, distinctDependencies:[] });
},

end: function () {
_frames.pop();
},

registerDependency: function (subscribable) {
if (!ko.isSubscribable(subscribable))
throw new Error("Only subscribable things can act as dependencies");
if (_frames.length > 0) {
var topFrame = _frames[_frames.length - 1];
if (!topFrame || ko.utils.arrayIndexOf(topFrame.distinctDependencies, subscribable) >= 0)
return;
topFrame.distinctDependencies.push(subscribable);
topFrame.callback(subscribable);
}
},

ignore: function(callback, callbackTarget, callbackArgs) {
try {
_frames.push(null);
return callback.apply(callbackTarget, callbackArgs || []);
} finally {
_frames.pop();
}
}
};
})();
ko.observable = function (initialValue) {
var _latestValue = initialValue;

function observable() {
if (arguments.length > 0) {



if (!observable['equalityComparer'] || !observable['equalityComparer'](_latestValue, arguments[0])) {
observable.valueWillMutate();
_latestValue = arguments[0];
if (DEBUG) observable._latestValue = _latestValue;
observable.valueHasMutated();
}
return this;
}
else {

ko.dependencyDetection.registerDependency(observable);
return _latestValue;
}
}
if (DEBUG) observable._latestValue = _latestValue;
ko.subscribable.call(observable);
observable.peek = function() { return _latestValue };
observable.valueHasMutated = function () { observable["notifySubscribers"](_latestValue); }
observable.valueWillMutate = function () { observable["notifySubscribers"](_latestValue, "beforeChange"); }
ko.utils.extend(observable, ko.observable['fn']);

ko.exportProperty(observable, 'peek', observable.peek);
ko.exportProperty(observable, "valueHasMutated", observable.valueHasMutated);
ko.exportProperty(observable, "valueWillMutate", observable.valueWillMutate);

return observable;
}

ko.observable['fn'] = {
"equalityComparer": valuesArePrimitiveAndEqual
};

var protoProperty = ko.observable.protoProperty = "__ko_proto__";
ko.observable['fn'][protoProperty] = ko.observable;

ko.hasPrototype = function(instance, prototype) {
if ((instance === null) || (instance === undefined) || (instance[protoProperty] === undefined)) return false;
if (instance[protoProperty] === prototype) return true;
return ko.hasPrototype(instance[protoProperty], prototype);
};

ko.isObservable = function (instance) {
return ko.hasPrototype(instance, ko.observable);
}
ko.isWriteableObservable = function (instance) {

if ((typeof instance == "function") && instance[protoProperty] === ko.observable)
return true;

if ((typeof instance == "function") && (instance[protoProperty] === ko.dependentObservable) && (instance.hasWriteFunction))
return true;

return false;
}


ko.exportSymbol('observable', ko.observable);
ko.exportSymbol('isObservable', ko.isObservable);
ko.exportSymbol('isWriteableObservable', ko.isWriteableObservable);
ko.observableArray = function (initialValues) {
initialValues = initialValues || [];

if (typeof initialValues != 'object' || !('length' in initialValues))
throw new Error("The argument passed when initializing an observable array must be an array, or null, or undefined.");

var result = ko.observable(initialValues);
ko.utils.extend(result, ko.observableArray['fn']);
return result.extend({'trackArrayChanges':true});
};

ko.observableArray['fn'] = {
'remove': function (valueOrPredicate) {
var underlyingArray = this.peek();
var removedValues = [];
var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
for (var i = 0; i < underlyingArray.length; i++) {
var value = underlyingArray[i];
if (predicate(value)) {
if (removedValues.length === 0) {
this.valueWillMutate();
}
removedValues.push(value);
underlyingArray.splice(i, 1);
i--;
}
}
if (removedValues.length) {
this.valueHasMutated();
}
return removedValues;
},

'removeAll': function (arrayOfValues) {

if (arrayOfValues === undefined) {
var underlyingArray = this.peek();
var allValues = underlyingArray.slice(0);
this.valueWillMutate();
underlyingArray.splice(0, underlyingArray.length);
this.valueHasMutated();
return allValues;
}

if (!arrayOfValues)
return [];
return this['remove'](function (value) {
return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
});
},

'destroy': function (valueOrPredicate) {
var underlyingArray = this.peek();
var predicate = typeof valueOrPredicate == "function" && !ko.isObservable(valueOrPredicate) ? valueOrPredicate : function (value) { return value === valueOrPredicate; };
this.valueWillMutate();
for (var i = underlyingArray.length - 1; i >= 0; i--) {
var value = underlyingArray[i];
if (predicate(value))
underlyingArray[i]["_destroy"] = true;
}
this.valueHasMutated();
},

'destroyAll': function (arrayOfValues) {

if (arrayOfValues === undefined)
return this['destroy'](function() { return true });


if (!arrayOfValues)
return [];
return this['destroy'](function (value) {
return ko.utils.arrayIndexOf(arrayOfValues, value) >= 0;
});
},

'indexOf': function (item) {
var underlyingArray = this();
return ko.utils.arrayIndexOf(underlyingArray, item);
},

'replace': function(oldItem, newItem) {
var index = this['indexOf'](oldItem);
if (index >= 0) {
this.valueWillMutate();
this.peek()[index] = newItem;
this.valueHasMutated();
}
}
};




ko.utils.arrayForEach(["pop", "push", "reverse", "shift", "sort", "splice", "unshift"], function (methodName) {
ko.observableArray['fn'][methodName] = function () {


var underlyingArray = this.peek();
this.valueWillMutate();
this.cacheDiffForKnownOperation(underlyingArray, methodName, arguments);
var methodCallResult = underlyingArray[methodName].apply(underlyingArray, arguments);
this.valueHasMutated();
return methodCallResult;
};
});


ko.utils.arrayForEach(["slice"], function (methodName) {
ko.observableArray['fn'][methodName] = function () {
var underlyingArray = this();
return underlyingArray[methodName].apply(underlyingArray, arguments);
};
});

ko.exportSymbol('observableArray', ko.observableArray);
var arrayChangeEventName = 'arrayChange';
ko.extenders['trackArrayChanges'] = function(target) {

if (target.cacheDiffForKnownOperation) {
return;
}
var trackingChanges = false,
cachedDiff = null,
pendingNotifications = 0,
underlyingSubscribeFunction = target.subscribe;


target.subscribe = target['subscribe'] = function(callback, callbackTarget, event) {
if (event === arrayChangeEventName) {
trackChanges();
}
return underlyingSubscribeFunction.apply(this, arguments);
};

function trackChanges() {

if (trackingChanges) {
return;
}

trackingChanges = true;


var underlyingNotifySubscribersFunction = target['notifySubscribers'];
target['notifySubscribers'] = function(valueToNotify, event) {
if (!event || event === defaultEvent) {
++pendingNotifications;
}
return underlyingNotifySubscribersFunction.apply(this, arguments);
};



var previousContents = [].concat(target.peek() || []);
cachedDiff = null;
target.subscribe(function(currentContents) {

currentContents = [].concat(currentContents || []);


if (target.hasSubscriptionsForEvent(arrayChangeEventName)) {
var changes = getChanges(previousContents, currentContents);
if (changes.length) {
target['notifySubscribers'](changes, arrayChangeEventName);
}
}


previousContents = currentContents;
cachedDiff = null;
pendingNotifications = 0;
});
}

function getChanges(previousContents, currentContents) {




if (!cachedDiff || pendingNotifications > 1) {
cachedDiff = ko.utils.compareArrays(previousContents, currentContents, { 'sparse': true });
}

return cachedDiff;
}

target.cacheDiffForKnownOperation = function(rawArray, operationName, args) {


if (!trackingChanges || pendingNotifications) {
return;
}
var diff = [],
arrayLength = rawArray.length,
argsLength = args.length,
offset = 0;

function pushDiff(status, value, index) {
diff.push({ 'status': status, 'value': value, 'index': index });
}
switch (operationName) {
case 'push':
offset = arrayLength;
case 'unshift':
for (var index = 0; index < argsLength; index++) {
pushDiff('added', args[index], offset + index);
}
break;

case 'pop':
offset = arrayLength - 1;
case 'shift':
if (arrayLength) {
pushDiff('deleted', rawArray[offset], offset);
}
break;

case 'splice':


var startIndex = Math.min(Math.max(0, args[0] < 0 ? arrayLength + args[0] : args[0]), arrayLength),
endDeleteIndex = argsLength === 1 ? arrayLength : Math.min(startIndex + (args[1] || 0), arrayLength),
endAddIndex = startIndex + argsLength - 2,
endIndex = Math.max(endDeleteIndex, endAddIndex);
for (var index = startIndex, argsIndex = 2; index < endIndex; ++index, ++argsIndex) {
if (index < endDeleteIndex)
pushDiff('deleted', rawArray[index], index);
if (index < endAddIndex)
pushDiff('added', args[argsIndex], index);
}
break;

default:
return;
}
cachedDiff = diff;
};
};
ko.dependentObservable = function (evaluatorFunctionOrOptions, evaluatorFunctionTarget, options) {
var _latestValue,
_hasBeenEvaluated = false,
_isBeingEvaluated = false,
_suppressDisposalUntilDisposeWhenReturnsFalse = false,
readFunction = evaluatorFunctionOrOptions;

if (readFunction && typeof readFunction == "object") {

options = readFunction;
readFunction = options["read"];
} else {

options = options || {};
if (!readFunction)
readFunction = options["read"];
}
if (typeof readFunction != "function")
throw new Error("Pass a function that returns the value of the ko.computed");

function addSubscriptionToDependency(subscribable) {
_subscriptionsToDependencies.push(subscribable.subscribe(evaluatePossiblyAsync));
}

function disposeAllSubscriptionsToDependencies() {
ko.utils.arrayForEach(_subscriptionsToDependencies, function (subscription) {
subscription.dispose();
});
_subscriptionsToDependencies = [];
}

function evaluatePossiblyAsync() {
var throttleEvaluationTimeout = dependentObservable['throttleEvaluation'];
if (throttleEvaluationTimeout && throttleEvaluationTimeout >= 0) {
clearTimeout(evaluationTimeoutInstance);
evaluationTimeoutInstance = setTimeout(evaluateImmediate, throttleEvaluationTimeout);
} else
evaluateImmediate();
}

function evaluateImmediate() {
if (_isBeingEvaluated) {




return;
}

if (disposeWhen && disposeWhen()) {

if (!_suppressDisposalUntilDisposeWhenReturnsFalse) {
dispose();
_hasBeenEvaluated = true;
return;
}
} else {

_suppressDisposalUntilDisposeWhenReturnsFalse = false;
}

_isBeingEvaluated = true;
try {


var disposalCandidates = ko.utils.arrayMap(_subscriptionsToDependencies, function(item) {return item.target;});

ko.dependencyDetection.begin(function(subscribable) {
var inOld;
if ((inOld = ko.utils.arrayIndexOf(disposalCandidates, subscribable)) >= 0)
disposalCandidates[inOld] = undefined;
else
addSubscriptionToDependency(subscribable);
});

var newValue = evaluatorFunctionTarget ? readFunction.call(evaluatorFunctionTarget) : readFunction();


for (var i = disposalCandidates.length - 1; i >= 0; i--) {
if (disposalCandidates[i])
_subscriptionsToDependencies.splice(i, 1)[0].dispose();
}
_hasBeenEvaluated = true;

if (!dependentObservable['equalityComparer'] || !dependentObservable['equalityComparer'](_latestValue, newValue)) {
dependentObservable["notifySubscribers"](_latestValue, "beforeChange");

_latestValue = newValue;
if (DEBUG) dependentObservable._latestValue = _latestValue;
dependentObservable["notifySubscribers"](_latestValue);
}
} finally {
ko.dependencyDetection.end();
_isBeingEvaluated = false;
}

if (!_subscriptionsToDependencies.length)
dispose();
}

function dependentObservable() {
if (arguments.length > 0) {
if (typeof writeFunction === "function") {

writeFunction.apply(evaluatorFunctionTarget, arguments);
} else {
throw new Error("Cannot write a value to a ko.computed unless you specify a 'write' option. If you wish to read the current value, don't pass any parameters.");
}
return this;
} else {

if (!_hasBeenEvaluated)
evaluateImmediate();
ko.dependencyDetection.registerDependency(dependentObservable);
return _latestValue;
}
}

function peek() {
if (!_hasBeenEvaluated)
evaluateImmediate();
return _latestValue;
}

function isActive() {
return !_hasBeenEvaluated || _subscriptionsToDependencies.length > 0;
}


var writeFunction = options["write"],
disposeWhenNodeIsRemoved = options["disposeWhenNodeIsRemoved"] || options.disposeWhenNodeIsRemoved || null,
disposeWhenOption = options["disposeWhen"] || options.disposeWhen,
disposeWhen = disposeWhenOption,
dispose = disposeAllSubscriptionsToDependencies,
_subscriptionsToDependencies = [],
evaluationTimeoutInstance = null;

if (!evaluatorFunctionTarget)
evaluatorFunctionTarget = options["owner"];

dependentObservable.peek = peek;
dependentObservable.getDependenciesCount = function () { return _subscriptionsToDependencies.length; };
dependentObservable.hasWriteFunction = typeof options["write"] === "function";
dependentObservable.dispose = function () { dispose(); };
dependentObservable.isActive = isActive;

ko.subscribable.call(dependentObservable);
ko.utils.extend(dependentObservable, ko.dependentObservable['fn']);

ko.exportProperty(dependentObservable, 'peek', dependentObservable.peek);
ko.exportProperty(dependentObservable, 'dispose', dependentObservable.dispose);
ko.exportProperty(dependentObservable, 'isActive', dependentObservable.isActive);
ko.exportProperty(dependentObservable, 'getDependenciesCount', dependentObservable.getDependenciesCount);


if (disposeWhenNodeIsRemoved) {



_suppressDisposalUntilDisposeWhenReturnsFalse = true;






if (disposeWhenNodeIsRemoved.nodeType) {
disposeWhen = function () {
return !ko.utils.domNodeIsAttachedToDocument(disposeWhenNodeIsRemoved) || (disposeWhenOption && disposeWhenOption());
};
}
}


if (options['deferEvaluation'] !== true)
evaluateImmediate();



if (disposeWhenNodeIsRemoved && isActive()) {
dispose = function() {
ko.utils.domNodeDisposal.removeDisposeCallback(disposeWhenNodeIsRemoved, dispose);
disposeAllSubscriptionsToDependencies();
};
ko.utils.domNodeDisposal.addDisposeCallback(disposeWhenNodeIsRemoved, dispose);
}

return dependentObservable;
};

ko.isComputed = function(instance) {
return ko.hasPrototype(instance, ko.dependentObservable);
};

var protoProp = ko.observable.protoProperty;
ko.dependentObservable[protoProp] = ko.observable;

ko.dependentObservable['fn'] = {
"equalityComparer": valuesArePrimitiveAndEqual
};
ko.dependentObservable['fn'][protoProp] = ko.dependentObservable;

ko.exportSymbol('dependentObservable', ko.dependentObservable);
ko.exportSymbol('computed', ko.dependentObservable);
ko.exportSymbol('isComputed', ko.isComputed);

(function() {
var maxNestedObservableDepth = 10;

ko.toJS = function(rootObject) {
if (arguments.length == 0)
throw new Error("When calling ko.toJS, pass the object you want to convert.");


return mapJsObjectGraph(rootObject, function(valueToMap) {

for (var i = 0; ko.isObservable(valueToMap) && (i < maxNestedObservableDepth); i++)
valueToMap = valueToMap();
return valueToMap;
});
};

ko.toJSON = function(rootObject, replacer, space) {
var plainJavaScriptObject = ko.toJS(rootObject);
return ko.utils.stringifyJson(plainJavaScriptObject, replacer, space);
};

function mapJsObjectGraph(rootObject, mapInputCallback, visitedObjects) {
visitedObjects = visitedObjects || new objectLookup();

rootObject = mapInputCallback(rootObject);
var canHaveProperties = (typeof rootObject == "object") && (rootObject !== null) && (rootObject !== undefined) && (!(rootObject instanceof Date)) && (!(rootObject instanceof String)) && (!(rootObject instanceof Number)) && (!(rootObject instanceof Boolean));
if (!canHaveProperties)
return rootObject;

var outputProperties = rootObject instanceof Array ? [] : {};
visitedObjects.save(rootObject, outputProperties);

visitPropertiesOrArrayEntries(rootObject, function(indexer) {
var propertyValue = mapInputCallback(rootObject[indexer]);

switch (typeof propertyValue) {
case "boolean":
case "number":
case "string":
case "function":
outputProperties[indexer] = propertyValue;
break;
case "object":
case "undefined":
var previouslyMappedValue = visitedObjects.get(propertyValue);
outputProperties[indexer] = (previouslyMappedValue !== undefined)
? previouslyMappedValue
: mapJsObjectGraph(propertyValue, mapInputCallback, visitedObjects);
break;
}
});

return outputProperties;
}

function visitPropertiesOrArrayEntries(rootObject, visitorCallback) {
if (rootObject instanceof Array) {
for (var i = 0; i < rootObject.length; i++)
visitorCallback(i);


if (typeof rootObject['toJSON'] == 'function')
visitorCallback('toJSON');
} else {
for (var propertyName in rootObject) {
visitorCallback(propertyName);
}
}
};

function objectLookup() {
this.keys = [];
this.values = [];
};

objectLookup.prototype = {
constructor: objectLookup,
save: function(key, value) {
var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
if (existingIndex >= 0)
this.values[existingIndex] = value;
else {
this.keys.push(key);
this.values.push(value);
}
},
get: function(key) {
var existingIndex = ko.utils.arrayIndexOf(this.keys, key);
return (existingIndex >= 0) ? this.values[existingIndex] : undefined;
}
};
})();

ko.exportSymbol('toJS', ko.toJS);
ko.exportSymbol('toJSON', ko.toJSON);
(function () {
var hasDomDataExpandoProperty = '__ko__hasDomDataOptionValue__';




ko.selectExtensions = {
readValue : function(element) {
switch (ko.utils.tagNameLower(element)) {
case 'option':
if (element[hasDomDataExpandoProperty] === true)
return ko.utils.domData.get(element, ko.bindingHandlers.options.optionValueDomDataKey);
return ko.utils.ieVersion <= 7
? (element.getAttributeNode('value') && element.getAttributeNode('value').specified ? element.value : element.text)
: element.value;
case 'select':
return element.selectedIndex >= 0 ? ko.selectExtensions.readValue(element.options[element.selectedIndex]) : undefined;
default:
return element.value;
}
},

writeValue: function(element, value) {
switch (ko.utils.tagNameLower(element)) {
case 'option':
switch(typeof value) {
case "string":
ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, undefined);
if (hasDomDataExpandoProperty in element) {
delete element[hasDomDataExpandoProperty];
}
element.value = value;
break;
default:

ko.utils.domData.set(element, ko.bindingHandlers.options.optionValueDomDataKey, value);
element[hasDomDataExpandoProperty] = true;


element.value = typeof value === "number" ? value : "";
break;
}
break;
case 'select':
if (value === "")
value = undefined;
if (value === null || value === undefined)
element.selectedIndex = -1;
for (var i = element.options.length - 1; i >= 0; i--) {
if (ko.selectExtensions.readValue(element.options[i]) == value) {
element.selectedIndex = i;
break;
}
}

if (!(element.size > 1) && element.selectedIndex === -1) {
element.selectedIndex = 0;
}
break;
default:
if ((value === null) || (value === undefined))
value = "";
element.value = value;
break;
}
}
};
})();

ko.exportSymbol('selectExtensions', ko.selectExtensions);
ko.exportSymbol('selectExtensions.readValue', ko.selectExtensions.readValue);
ko.exportSymbol('selectExtensions.writeValue', ko.selectExtensions.writeValue);
ko.expressionRewriting = (function () {
var javaScriptReservedWords = ["true", "false", "null", "undefined"];




var javaScriptAssignmentTarget = /^(?:[$_a-z][$\w]*|(.+)(\.\s*[$_a-z][$\w]*|\[.+\]))$/i;

function getWriteableValue(expression) {
if (ko.utils.arrayIndexOf(javaScriptReservedWords, expression) >= 0)
return false;
var match = expression.match(javaScriptAssignmentTarget);
return match === null ? false : match[1] ? ('Object(' + match[1] + ')' + match[2]) : expression;
}




var stringDouble = '"(?:[^"\\\\]|\\\\.)*"',
stringSingle = "'(?:[^'\\\\]|\\\\.)*'",


stringRegexp = '/(?:[^/\\\\]|\\\\.)*/\w*',


specials = ',"\'{}()/:[\\]',



everyThingElse = '[^\\s:,/][^' + specials + ']*[^\\s' + specials + ']',



oneNotSpace = '[^\\s]',


bindingToken = RegExp(stringDouble + '|' + stringSingle + '|' + stringRegexp + '|' + everyThingElse + '|' + oneNotSpace, 'g'),


divisionLookBehind = /[\])"'A-Za-z0-9_$]+$/,
keywordRegexLookBehind = {'in':1,'return':1,'typeof':1};

function parseObjectLiteral(objectLiteralString) {
// Trim leading and trailing spaces from the string
var str = ko.utils.stringTrim(objectLiteralString);

// Trim braces '{' surrounding the whole object literal
if (str.charCodeAt(0) === 123) str = str.slice(1, -1);

// Split into tokens
var result = [], toks = str.match(bindingToken), key, values, depth = 0;

if (toks) {
// Append a comma so that we don't need a separate code block to deal with the last item
toks.push(',');

for (var i = 0, tok; tok = toks[i]; ++i) {
var c = tok.charCodeAt(0);
// A comma signals the end of a key/value pair if depth is zero
if (c === 44) { // ","
if (depth <= 0) {
if (key)
result.push(values ? {key: key, value: values.join('')} : {'unknown': key});
key = values = depth = 0;
continue;
}
// Simply skip the colon that separates the name and value
} else if (c === 58) { // ":"
if (!values)
continue;
// A set of slashes is initially matched as a regular expression, but could be division
} else if (c === 47 && i && tok.length > 1) {  // "/"
// Look at the end of the previous token to determine if the slash is actually division
var match = toks[i-1].match(divisionLookBehind);
if (match && !keywordRegexLookBehind[match[0]]) {
// The slash is actually a division punctuator; re-parse the remainder of the string (not including the slash)
str = str.substr(str.indexOf(tok) + 1);
toks = str.match(bindingToken);
toks.push(',');
i = -1;
// Continue with just the slash
tok = '/';
}
// Increment depth for parentheses, braces, and brackets so that interior commas are ignored
} else if (c === 40 || c === 123 || c === 91) { // '(', '{', '['
++depth;
} else if (c === 41 || c === 125 || c === 93) { // ')', '}', ']'
--depth;
// The key must be a single token; if it's a string, trim the quotes
} else if (!key && !values) {
key = (c === 34 || c === 39) /* '"', "'" */ ? tok.slice(1, -1) : tok;
continue;
}
if (values)
values.push(tok);
else
values = [tok];
}
}
return result;
}

// Two-way bindings include a write function that allow the handler to update the value even if it's not an observable.
var twoWayBindings = {};

function preProcessBindings(bindingsStringOrKeyValueArray, bindingOptions) {
bindingOptions = bindingOptions || {};

function processKeyValue(key, val) {
var writableVal;
function callPreprocessHook(obj) {
return (obj && obj['preprocess']) ? (val = obj['preprocess'](val, key, processKeyValue)) : true;
}
if (!callPreprocessHook(ko['getBindingHandler'](key)))
return;

if (twoWayBindings[key] && (writableVal = getWriteableValue(val))) {
// For two-way bindings, provide a write method in case the value
// isn't a writable observable.
propertyAccessorResultStrings.push("'" + key + "':function(_z){" + writableVal + "=_z}");
}

// Values are wrapped in a function so that each value can be accessed independently
if (makeValueAccessors) {
val = 'function(){return ' + val + ' }';
}
resultStrings.push("'" + key + "':" + val);
}

var resultStrings = [],
propertyAccessorResultStrings = [],
makeValueAccessors = bindingOptions['valueAccessors'],
keyValueArray = typeof bindingsStringOrKeyValueArray === "string" ?
parseObjectLiteral(bindingsStringOrKeyValueArray) : bindingsStringOrKeyValueArray;

ko.utils.arrayForEach(keyValueArray, function(keyValue) {
processKeyValue(keyValue.key || keyValue['unknown'], keyValue.value);
});

if (propertyAccessorResultStrings.length)
processKeyValue('_ko_property_writers', "{" + propertyAccessorResultStrings.join(",") + "}");

return resultStrings.join(",");
}

return {
bindingRewriteValidators: [],

twoWayBindings: twoWayBindings,

parseObjectLiteral: parseObjectLiteral,

preProcessBindings: preProcessBindings,

keyValueArrayContainsKey: function(keyValueArray, key) {
for (var i = 0; i < keyValueArray.length; i++)
if (keyValueArray[i]['key'] == key)
return true;
return false;
},

// Internal, private KO utility for updating model properties from within bindings
// property:            If the property being updated is (or might be) an observable, pass it here
//                      If it turns out to be a writable observable, it will be written to directly
// allBindings:         An object with a get method to retrieve bindings in the current execution context.
//                      This will be searched for a '_ko_property_writers' property in case you're writing to a non-observable
// key:                 The key identifying the property to be written. Example: for { hasFocus: myValue }, write to 'myValue' by specifying the key 'hasFocus'
// value:               The value to be written
// checkIfDifferent:    If true, and if the property being written is a writable observable, the value will only be written if
//                      it is !== existing value on that writable observable
writeValueToProperty: function(property, allBindings, key, value, checkIfDifferent) {
if (!property || !ko.isObservable(property)) {
var propWriters = allBindings.get('_ko_property_writers');
if (propWriters && propWriters[key])
propWriters[key](value);
} else if (ko.isWriteableObservable(property) && (!checkIfDifferent || property.peek() !== value)) {
property(value);
}
}
};
})();

ko.exportSymbol('expressionRewriting', ko.expressionRewriting);
ko.exportSymbol('expressionRewriting.bindingRewriteValidators', ko.expressionRewriting.bindingRewriteValidators);
ko.exportSymbol('expressionRewriting.parseObjectLiteral', ko.expressionRewriting.parseObjectLiteral);
ko.exportSymbol('expressionRewriting.preProcessBindings', ko.expressionRewriting.preProcessBindings);

// Making bindings explicitly declare themselves as "two way" isn't ideal in the long term (it would be better if
// all bindings could use an official 'property writer' API without needing to declare that they might). However,
// since this is not, and has never been, a public API (_ko_property_writers was never documented), it's acceptable
// as an internal implementation detail in the short term.
// For those developers who rely on _ko_property_writers in their custom bindings, we expose _twoWayBindings as an
// undocumented feature that makes it relatively easy to upgrade to KO 3.0. However, this is still not an official
// public API, and we reserve the right to remove it at any time if we create a real public property writers API.
ko.exportSymbol('expressionRewriting._twoWayBindings', ko.expressionRewriting.twoWayBindings);

// For backward compatibility, define the following aliases. (Previously, these function names were misleading because
// they referred to JSON specifically, even though they actually work with arbitrary JavaScript object literal expressions.)
ko.exportSymbol('jsonExpressionRewriting', ko.expressionRewriting);
ko.exportSymbol('jsonExpressionRewriting.insertPropertyAccessorsIntoJson', ko.expressionRewriting.preProcessBindings);
(function() {
// "Virtual elements" is an abstraction on top of the usual DOM API which understands the notion that comment nodes
// may be used to represent hierarchy (in addition to the DOM's natural hierarchy).
// If you call the DOM-manipulating functions on ko.virtualElements, you will be able to read and write the state
// of that virtual hierarchy
//
// The point of all this is to support containerless templates (e.g., <!-- ko foreach:someCollection -->blah<!-- /ko -->)
// without having to scatter special cases all over the binding and templating code.

// IE 9 cannot reliably read the "nodeValue" property of a comment node (see https://github.com/SteveSanderson/knockout/issues/186)
// but it does give them a nonstandard alternative property called "text" that it can read reliably. Other browsers don't have that property.
// So, use node.text where available, and node.nodeValue elsewhere
var commentNodesHaveTextProperty = document && document.createComment("test").text === "<!--test-->";

var startCommentRegex = commentNodesHaveTextProperty ? /^<!--\s*ko(?:\s+([\s\S]+))?\s*-->$/ : /^\s*ko(?:\s+([\s\S]+))?\s*$/;
var endCommentRegex =   commentNodesHaveTextProperty ? /^<!--\s*\/ko\s*-->$/ : /^\s*\/ko\s*$/;
var htmlTagsWithOptionallyClosingChildren = { 'ul': true, 'ol': true };

function isStartComment(node) {
return (node.nodeType == 8) && startCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
}

function isEndComment(node) {
return (node.nodeType == 8) && endCommentRegex.test(commentNodesHaveTextProperty ? node.text : node.nodeValue);
}

function getVirtualChildren(startComment, allowUnbalanced) {
var currentNode = startComment;
var depth = 1;
var children = [];
while (currentNode = currentNode.nextSibling) {
if (isEndComment(currentNode)) {
depth--;
if (depth === 0)
return children;
}

children.push(currentNode);

if (isStartComment(currentNode))
depth++;
}
if (!allowUnbalanced)
throw new Error("Cannot find closing comment tag to match: " + startComment.nodeValue);
return null;
}

function getMatchingEndComment(startComment, allowUnbalanced) {
var allVirtualChildren = getVirtualChildren(startComment, allowUnbalanced);
if (allVirtualChildren) {
if (allVirtualChildren.length > 0)
return allVirtualChildren[allVirtualChildren.length - 1].nextSibling;
return startComment.nextSibling;
} else
return null; // Must have no matching end comment, and allowUnbalanced is true
}

function getUnbalancedChildTags(node) {
// e.g., from <div>OK</div><!-- ko blah --><span>Another</span>, returns: <!-- ko blah --><span>Another</span>
//       from <div>OK</div><!-- /ko --><!-- /ko -->,             returns: <!-- /ko --><!-- /ko -->
var childNode = node.firstChild, captureRemaining = null;
if (childNode) {
do {
if (captureRemaining)                   // We already hit an unbalanced node and are now just scooping up all subsequent nodes
captureRemaining.push(childNode);
else if (isStartComment(childNode)) {
var matchingEndComment = getMatchingEndComment(childNode, /* allowUnbalanced: */ true);
if (matchingEndComment)             // It's a balanced tag, so skip immediately to the end of this virtual set
childNode = matchingEndComment;
else
captureRemaining = [childNode]; // It's unbalanced, so start capturing from this point
} else if (isEndComment(childNode)) {
captureRemaining = [childNode];     // It's unbalanced (if it wasn't, we'd have skipped over it already), so start capturing
}
} while (childNode = childNode.nextSibling);
}
return captureRemaining;
}

ko.virtualElements = {
allowedBindings: {},

childNodes: function(node) {
return isStartComment(node) ? getVirtualChildren(node) : node.childNodes;
},

emptyNode: function(node) {
if (!isStartComment(node))
ko.utils.emptyDomNode(node);
else {
var virtualChildren = ko.virtualElements.childNodes(node);
for (var i = 0, j = virtualChildren.length; i < j; i++)
ko.removeNode(virtualChildren[i]);
}
},

setDomNodeChildren: function(node, childNodes) {
if (!isStartComment(node))
ko.utils.setDomNodeChildren(node, childNodes);
else {
ko.virtualElements.emptyNode(node);
var endCommentNode = node.nextSibling; // Must be the next sibling, as we just emptied the children
for (var i = 0, j = childNodes.length; i < j; i++)
endCommentNode.parentNode.insertBefore(childNodes[i], endCommentNode);
}
},

prepend: function(containerNode, nodeToPrepend) {
if (!isStartComment(containerNode)) {
if (containerNode.firstChild)
containerNode.insertBefore(nodeToPrepend, containerNode.firstChild);
else
containerNode.appendChild(nodeToPrepend);
} else {
// Start comments must always have a parent and at least one following sibling (the end comment)
containerNode.parentNode.insertBefore(nodeToPrepend, containerNode.nextSibling);
}
},

insertAfter: function(containerNode, nodeToInsert, insertAfterNode) {
if (!insertAfterNode) {
ko.virtualElements.prepend(containerNode, nodeToInsert);
} else if (!isStartComment(containerNode)) {
// Insert after insertion point
if (insertAfterNode.nextSibling)
containerNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
else
containerNode.appendChild(nodeToInsert);
} else {
// Children of start comments must always have a parent and at least one following sibling (the end comment)
containerNode.parentNode.insertBefore(nodeToInsert, insertAfterNode.nextSibling);
}
},

firstChild: function(node) {
if (!isStartComment(node))
return node.firstChild;
if (!node.nextSibling || isEndComment(node.nextSibling))
return null;
return node.nextSibling;
},

nextSibling: function(node) {
if (isStartComment(node))
node = getMatchingEndComment(node);
if (node.nextSibling && isEndComment(node.nextSibling))
return null;
return node.nextSibling;
},

hasBindingValue: isStartComment,

virtualNodeBindingValue: function(node) {
var regexMatch = (commentNodesHaveTextProperty ? node.text : node.nodeValue).match(startCommentRegex);
return regexMatch ? regexMatch[1] : null;
},

normaliseVirtualElementDomStructure: function(elementVerified) {
// Workaround for https://github.com/SteveSanderson/knockout/issues/155
// (IE <= 8 or IE 9 quirks mode parses your HTML weirdly, treating closing </li> tags as if they don't exist, thereby moving comment nodes
// that are direct descendants of <ul> into the preceding <li>)
if (!htmlTagsWithOptionallyClosingChildren[ko.utils.tagNameLower(elementVerified)])
return;

// Scan immediate children to see if they contain unbalanced comment tags. If they do, those comment tags
// must be intended to appear *after* that child, so move them there.
var childNode = elementVerified.firstChild;
if (childNode) {
do {
if (childNode.nodeType === 1) {
var unbalancedTags = getUnbalancedChildTags(childNode);
if (unbalancedTags) {
// Fix up the DOM by moving the unbalanced tags to where they most likely were intended to be placed - *after* the child
var nodeToInsertBefore = childNode.nextSibling;
for (var i = 0; i < unbalancedTags.length; i++) {
if (nodeToInsertBefore)
elementVerified.insertBefore(unbalancedTags[i], nodeToInsertBefore);
else
elementVerified.appendChild(unbalancedTags[i]);
}
}
}
} while (childNode = childNode.nextSibling);
}
}
};
})();
ko.exportSymbol('virtualElements', ko.virtualElements);
ko.exportSymbol('virtualElements.allowedBindings', ko.virtualElements.allowedBindings);
ko.exportSymbol('virtualElements.emptyNode', ko.virtualElements.emptyNode);
//ko.exportSymbol('virtualElements.firstChild', ko.virtualElements.firstChild);     // firstChild is not minified
ko.exportSymbol('virtualElements.insertAfter', ko.virtualElements.insertAfter);
//ko.exportSymbol('virtualElements.nextSibling', ko.virtualElements.nextSibling);   // nextSibling is not minified
ko.exportSymbol('virtualElements.prepend', ko.virtualElements.prepend);
ko.exportSymbol('virtualElements.setDomNodeChildren', ko.virtualElements.setDomNodeChildren);
(function() {
var defaultBindingAttributeName = "data-bind";

ko.bindingProvider = function() {
this.bindingCache = {};
};

ko.utils.extend(ko.bindingProvider.prototype, {
'nodeHasBindings': function(node) {
switch (node.nodeType) {
case 1: return node.getAttribute(defaultBindingAttributeName) != null;   // Element
case 8: return ko.virtualElements.hasBindingValue(node); // Comment node
default: return false;
}
},

'getBindings': function(node, bindingContext) {
var bindingsString = this['getBindingsString'](node, bindingContext);
return bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node) : null;
},

'getBindingAccessors': function(node, bindingContext) {
var bindingsString = this['getBindingsString'](node, bindingContext);
return bindingsString ? this['parseBindingsString'](bindingsString, bindingContext, node, {'valueAccessors':true}) : null;
},

// The following function is only used internally by this default provider.
// It's not part of the interface definition for a general binding provider.
'getBindingsString': function(node, bindingContext) {
switch (node.nodeType) {
case 1: return node.getAttribute(defaultBindingAttributeName);   // Element
case 8: return ko.virtualElements.virtualNodeBindingValue(node); // Comment node
default: return null;
}
},

// The following function is only used internally by this default provider.
// It's not part of the interface definition for a general binding provider.
'parseBindingsString': function(bindingsString, bindingContext, node, options) {
try {
var bindingFunction = createBindingsStringEvaluatorViaCache(bindingsString, this.bindingCache, options);
return bindingFunction(bindingContext, node);
} catch (ex) {
ex.message = "Unable to parse bindings.\nBindings value: " + bindingsString + "\nMessage: " + ex.message;
throw ex;
}
}
});

ko.bindingProvider['instance'] = new ko.bindingProvider();

function createBindingsStringEvaluatorViaCache(bindingsString, cache, options) {
var cacheKey = bindingsString + (options && options['valueAccessors'] || '');
return cache[cacheKey]
|| (cache[cacheKey] = createBindingsStringEvaluator(bindingsString, options));
}

function createBindingsStringEvaluator(bindingsString, options) {
// Build the source for a function that evaluates "expression"
// For each scope variable, add an extra level of "with" nesting
// Example result: with(sc1) { with(sc0) { return (expression) } }
var rewrittenBindings = ko.expressionRewriting.preProcessBindings(bindingsString, options),
functionBody = "with($context){with($data||{}){return{" + rewrittenBindings + "}}}";
return new Function("$context", "$element", functionBody);
}
})();

ko.exportSymbol('bindingProvider', ko.bindingProvider);
(function () {
ko.bindingHandlers = {};

// The following element types will not be recursed into during binding. In the future, we
// may consider adding <template> to this list, because such elements' contents are always
// intended to be bound in a different context from where they appear in the document.
var bindingDoesNotRecurseIntoElementTypes = {
// Don't want bindings that operate on text nodes to mutate <script> contents,
// because it's unexpected and a potential XSS issue
'script': true
};

// Use an overridable method for retrieving binding handlers so that a plugins may support dynamically created handlers
ko['getBindingHandler'] = function(bindingKey) {
return ko.bindingHandlers[bindingKey];
};

// The ko.bindingContext constructor is only called directly to create the root context. For child
// contexts, use bindingContext.createChildContext or bindingContext.extend.
ko.bindingContext = function(dataItemOrAccessor, parentContext, dataItemAlias, extendCallback) {

// The binding context object includes static properties for the current, parent, and root view models.
// If a view model is actually stored in an observable, the corresponding binding context object, and
// any child contexts, must be updated when the view model is changed.
function updateContext() {
// Most of the time, the context will directly get a view model object, but if a function is given,
// we call the function to retrieve the view model. If the function accesses any obsevables (or is
// itself an observable), the dependency is tracked, and those observables can later cause the binding
// context to be updated.
var dataItem = isFunc ? dataItemOrAccessor() : dataItemOrAccessor;

if (parentContext) {
// When a "parent" context is given, register a dependency on the parent context. Thus whenever the
// parent context is updated, this context will also be updated.
if (parentContext._subscribable)
parentContext._subscribable();

// Copy $root and any custom properties from the parent context
ko.utils.extend(self, parentContext);

// Because the above copy overwrites our own properties, we need to reset them.
// During the first execution, "subscribable" isn't set, so don't bother doing the update then.
if (subscribable) {
self._subscribable = subscribable;
}
} else {
self['$parents'] = [];
self['$root'] = dataItem;

// Export 'ko' in the binding context so it will be available in bindings and templates
// even if 'ko' isn't exported as a global, such as when using an AMD loader.
// See https://github.com/SteveSanderson/knockout/issues/490
self['ko'] = ko;
}
self['$rawData'] = dataItemOrAccessor;
self['$data'] = dataItem;
if (dataItemAlias)
self[dataItemAlias] = dataItem;

// The extendCallback function is provided when creating a child context or extending a context.
// It handles the specific actions needed to finish setting up the binding context. Actions in this
// function could also add dependencies to this binding context.
if (extendCallback)
extendCallback(self, parentContext, dataItem);

return self['$data'];
}
function disposeWhen() {
return nodes && !ko.utils.anyDomNodeIsAttachedToDocument(nodes);
}

var self = this,
isFunc = typeof(dataItemOrAccessor) == "function",
nodes,
subscribable = ko.dependentObservable(updateContext, null, { disposeWhen: disposeWhen, disposeWhenNodeIsRemoved: true });

// At this point, the binding context has been initialized, and the "subscribable" computed observable is
// subscribed to any observables that were accessed in the process. If there is nothing to track, the
// computed will be inactive, and we can safely throw it away. If it's active, the computed is stored in
// the context object.
if (subscribable.isActive()) {
self._subscribable = subscribable;

// Always notify because even if the model ($data) hasn't changed, other context properties might have changed
subscribable['equalityComparer'] = null;

// We need to be able to dispose of this computed observable when it's no longer needed. This would be
// easy if we had a single node to watch, but binding contexts can be used by many different nodes, and
// we cannot assume that those nodes have any relation to each other. So instead we track any node that
// the context is attached to, and dispose the computed when all of those nodes have been cleaned.

// Add properties to *subscribable* instead of *self* because any properties added to *self* may be overwritten on updates
nodes = [];
subscribable._addNode = function(node) {
nodes.push(node);
ko.utils.domNodeDisposal.addDisposeCallback(node, function(node) {
ko.utils.arrayRemoveItem(nodes, node);
if (!nodes.length) {
subscribable.dispose();
self._subscribable = subscribable = undefined;
}
});
};
}
}

// Extend the binding context hierarchy with a new view model object. If the parent context is watching
// any obsevables, the new child context will automatically get a dependency on the parent context.
// But this does not mean that the $data value of the child context will also get updated. If the child
// view model also depends on the parent view model, you must provide a function that returns the correct
// view model on each update.
ko.bindingContext.prototype['createChildContext'] = function (dataItemOrAccessor, dataItemAlias, extendCallback) {
return new ko.bindingContext(dataItemOrAccessor, this, dataItemAlias, function(self, parentContext) {
// Extend the context hierarchy by setting the appropriate pointers
self['$parentContext'] = parentContext;
self['$parent'] = parentContext['$data'];
self['$parents'] = (parentContext['$parents'] || []).slice(0);
self['$parents'].unshift(self['$parent']);
if (extendCallback)
extendCallback(self);
});
};

// Extend the binding context with new custom properties. This doesn't change the context hierarchy.
// Similarly to "child" contexts, provide a function here to make sure that the correct values are set
// when an observable view model is updated.
ko.bindingContext.prototype['extend'] = function(properties) {
return new ko.bindingContext(this['$rawData'], this, null, function(self) {
ko.utils.extend(self, typeof(properties) == "function" ? properties() : properties);
});
};

// Returns the valueAccesor function for a binding value
function makeValueAccessor(value) {
return function() {
return value;
};
}

// Returns the value of a valueAccessor function
function evaluateValueAccessor(valueAccessor) {
return valueAccessor();
}

// Given a function that returns bindings, create and return a new object that contains
// binding value-accessors functions. Each accessor function calls the original function
// so that it always gets the latest value and all dependencies are captured. This is used
// by ko.applyBindingsToNode and getBindingsAndMakeAccessors.
function makeAccessorsFromFunction(callback) {
return ko.utils.objectMap(ko.dependencyDetection.ignore(callback), function(value, key) {
return function() {
return callback()[key];
};
});
}

// Given a bindings function or object, create and return a new object that contains
// binding value-accessors functions. This is used by ko.applyBindingsToNode.
function makeBindingAccessors(bindings, context, node) {
if (typeof bindings === 'function') {
return makeAccessorsFromFunction(bindings.bind(null, context, node));
} else {
return ko.utils.objectMap(bindings, makeValueAccessor);
}
}

// This function is used if the binding provider doesn't include a getBindingAccessors function.
// It must be called with 'this' set to the provider instance.
function getBindingsAndMakeAccessors(node, context) {
return makeAccessorsFromFunction(this['getBindings'].bind(this, node, context));
}

function validateThatBindingIsAllowedForVirtualElements(bindingName) {
var validator = ko.virtualElements.allowedBindings[bindingName];
if (!validator)
throw new Error("The binding '" + bindingName + "' cannot be used with virtual elements")
}

function applyBindingsToDescendantsInternal (bindingContext, elementOrVirtualElement, bindingContextsMayDifferFromDomParentElement) {
var currentChild,
nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement),
provider = ko.bindingProvider['instance'],
preprocessNode = provider['preprocessNode'];

// Preprocessing allows a binding provider to mutate a node before bindings are applied to it. For example it's
// possible to insert new siblings after it, and/or replace the node with a different one. This can be used to
// implement custom binding syntaxes, such as {{ value }} for string interpolation, or custom element types that
// trigger insertion of <template> contents at that point in the document.
if (preprocessNode) {
while (currentChild = nextInQueue) {
nextInQueue = ko.virtualElements.nextSibling(currentChild);
preprocessNode.call(provider, currentChild);
}
// Reset nextInQueue for the next loop
nextInQueue = ko.virtualElements.firstChild(elementOrVirtualElement);
}

while (currentChild = nextInQueue) {
// Keep a record of the next child *before* applying bindings, in case the binding removes the current child from its position
nextInQueue = ko.virtualElements.nextSibling(currentChild);
applyBindingsToNodeAndDescendantsInternal(bindingContext, currentChild, bindingContextsMayDifferFromDomParentElement);
}
}

function applyBindingsToNodeAndDescendantsInternal (bindingContext, nodeVerified, bindingContextMayDifferFromDomParentElement) {
var shouldBindDescendants = true;

// Perf optimisation: Apply bindings only if...
// (1) We need to store the binding context on this node (because it may differ from the DOM parent node's binding context)
//     Note that we can't store binding contexts on non-elements (e.g., text nodes), as IE doesn't allow expando properties for those
// (2) It might have bindings (e.g., it has a data-bind attribute, or it's a marker for a containerless template)
var isElement = (nodeVerified.nodeType === 1);
if (isElement) // Workaround IE <= 8 HTML parsing weirdness
ko.virtualElements.normaliseVirtualElementDomStructure(nodeVerified);

var shouldApplyBindings = (isElement && bindingContextMayDifferFromDomParentElement)             // Case (1)
|| ko.bindingProvider['instance']['nodeHasBindings'](nodeVerified);       // Case (2)
if (shouldApplyBindings)
shouldBindDescendants = applyBindingsToNodeInternal(nodeVerified, null, bindingContext, bindingContextMayDifferFromDomParentElement)['shouldBindDescendants'];

if (shouldBindDescendants && !bindingDoesNotRecurseIntoElementTypes[ko.utils.tagNameLower(nodeVerified)]) {
// We're recursing automatically into (real or virtual) child nodes without changing binding contexts. So,
//  * For children of a *real* element, the binding context is certainly the same as on their DOM .parentNode,
//    hence bindingContextsMayDifferFromDomParentElement is false
//  * For children of a *virtual* element, we can't be sure. Evaluating .parentNode on those children may
//    skip over any number of intermediate virtual elements, any of which might define a custom binding context,
//    hence bindingContextsMayDifferFromDomParentElement is true
applyBindingsToDescendantsInternal(bindingContext, nodeVerified, /* bindingContextsMayDifferFromDomParentElement: */ !isElement);
}
}

var boundElementDomDataKey = ko.utils.domData.nextKey();


function topologicalSortBindings(bindings) {
// Depth-first sort
var result = [],                // The list of key/handler pairs that we will return
bindingsConsidered = {},    // A temporary record of which bindings are already in 'result'
cyclicDependencyStack = []; // Keeps track of a depth-search so that, if there's a cycle, we know which bindings caused it
ko.utils.objectForEach(bindings, function pushBinding(bindingKey) {
if (!bindingsConsidered[bindingKey]) {
var binding = ko['getBindingHandler'](bindingKey);
if (binding) {
// First add dependencies (if any) of the current binding
if (binding['after']) {
cyclicDependencyStack.push(bindingKey);
ko.utils.arrayForEach(binding['after'], function(bindingDependencyKey) {
if (bindings[bindingDependencyKey]) {
if (ko.utils.arrayIndexOf(cyclicDependencyStack, bindingDependencyKey) !== -1) {
throw Error("Cannot combine the following bindings, because they have a cyclic dependency: " + cyclicDependencyStack.join(", "));
} else {
pushBinding(bindingDependencyKey);
}
}
});
cyclicDependencyStack.pop();
}
// Next add the current binding
result.push({ key: bindingKey, handler: binding });
}
bindingsConsidered[bindingKey] = true;
}
});

return result;
}

function applyBindingsToNodeInternal(node, sourceBindings, bindingContext, bindingContextMayDifferFromDomParentElement) {
// Prevent multiple applyBindings calls for the same node, except when a binding value is specified
var alreadyBound = ko.utils.domData.get(node, boundElementDomDataKey);
if (!sourceBindings) {
if (alreadyBound) {
throw Error("You cannot apply bindings multiple times to the same element.");
}
ko.utils.domData.set(node, boundElementDomDataKey, true);
}

// Optimization: Don't store the binding context on this node if it's definitely the same as on node.parentNode, because
// we can easily recover it just by scanning up the node's ancestors in the DOM
// (note: here, parent node means "real DOM parent" not "virtual parent", as there's no O(1) way to find the virtual parent)
if (!alreadyBound && bindingContextMayDifferFromDomParentElement)
ko.storedBindingContextForNode(node, bindingContext);

// Use bindings if given, otherwise fall back on asking the bindings provider to give us some bindings
var bindings;
if (sourceBindings && typeof sourceBindings !== 'function') {
bindings = sourceBindings;
} else {
var provider = ko.bindingProvider['instance'],
getBindings = provider['getBindingAccessors'] || getBindingsAndMakeAccessors;

if (sourceBindings || bindingContext._subscribable) {
// When an obsevable view model is used, the binding context will expose an observable _subscribable value.
// Get the binding from the provider within a computed observable so that we can update the bindings whenever
// the binding context is updated.
var bindingsUpdater = ko.dependentObservable(
function() {
bindings = sourceBindings ? sourceBindings(bindingContext, node) : getBindings.call(provider, node, bindingContext);
// Register a dependency on the binding context
if (bindings && bindingContext._subscribable)
bindingContext._subscribable();
return bindings;
},
null, { disposeWhenNodeIsRemoved: node }
);

if (!bindings || !bindingsUpdater.isActive())
bindingsUpdater = null;
} else {
bindings = ko.dependencyDetection.ignore(getBindings, provider, [node, bindingContext]);
}
}

var bindingHandlerThatControlsDescendantBindings;
if (bindings) {
// Return the value accessor for a given binding. When bindings are static (won't be updated because of a binding
// context update), just return the value accessor from the binding. Otherwise, return a function that always gets
// the latest binding value and registers a dependency on the binding updater.
var getValueAccessor = bindingsUpdater
? function(bindingKey) {
return function() {
return evaluateValueAccessor(bindingsUpdater()[bindingKey]);
};
} : function(bindingKey) {
return bindings[bindingKey];
};

// Use of allBindings as a function is maintained for backwards compatibility, but its use is deprecated
function allBindings() {
return ko.utils.objectMap(bindingsUpdater ? bindingsUpdater() : bindings, evaluateValueAccessor);
}
// The following is the 3.x allBindings API
allBindings['get'] = function(key) {
return bindings[key] && evaluateValueAccessor(getValueAccessor(key));
};
allBindings['has'] = function(key) {
return key in bindings;
};

// First put the bindings into the right order
var orderedBindings = topologicalSortBindings(bindings);

// Go through the sorted bindings, calling init and update for each
ko.utils.arrayForEach(orderedBindings, function(bindingKeyAndHandler) {
// Note that topologicalSortBindings has already filtered out any nonexistent binding handlers,
// so bindingKeyAndHandler.handler will always be nonnull.
var handlerInitFn = bindingKeyAndHandler.handler["init"],
handlerUpdateFn = bindingKeyAndHandler.handler["update"],
bindingKey = bindingKeyAndHandler.key;

if (node.nodeType === 8) {
validateThatBindingIsAllowedForVirtualElements(bindingKey);
}

try {
// Run init, ignoring any dependencies
if (typeof handlerInitFn == "function") {
ko.dependencyDetection.ignore(function() {
var initResult = handlerInitFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);

// If this binding handler claims to control descendant bindings, make a note of this
if (initResult && initResult['controlsDescendantBindings']) {
if (bindingHandlerThatControlsDescendantBindings !== undefined)
throw new Error("Multiple bindings (" + bindingHandlerThatControlsDescendantBindings + " and " + bindingKey + ") are trying to control descendant bindings of the same element. You cannot use these bindings together on the same element.");
bindingHandlerThatControlsDescendantBindings = bindingKey;
}
});
}

// Run update in its own computed wrapper
if (typeof handlerUpdateFn == "function") {
ko.dependentObservable(
function() {
handlerUpdateFn(node, getValueAccessor(bindingKey), allBindings, bindingContext['$data'], bindingContext);
},
null,
{ disposeWhenNodeIsRemoved: node }
);
}
} catch (ex) {
ex.message = "Unable to process binding \"" + bindingKey + ": " + bindings[bindingKey] + "\"\nMessage: " + ex.message;
throw ex;
}
});
}

return {
'shouldBindDescendants': bindingHandlerThatControlsDescendantBindings === undefined
};
};

var storedBindingContextDomDataKey = ko.utils.domData.nextKey();
ko.storedBindingContextForNode = function (node, bindingContext) {
if (arguments.length == 2) {
ko.utils.domData.set(node, storedBindingContextDomDataKey, bindingContext);
if (bindingContext._subscribable)
bindingContext._subscribable._addNode(node);
} else {
return ko.utils.domData.get(node, storedBindingContextDomDataKey);
}
}

function getBindingContext(viewModelOrBindingContext) {
return viewModelOrBindingContext && (viewModelOrBindingContext instanceof ko.bindingContext)
? viewModelOrBindingContext
: new ko.bindingContext(viewModelOrBindingContext);
}

ko.applyBindingAccessorsToNode = function (node, bindings, viewModelOrBindingContext) {
if (node.nodeType === 1)
ko.virtualElements.normaliseVirtualElementDomStructure(node);
return applyBindingsToNodeInternal(node, bindings, getBindingContext(viewModelOrBindingContext), true);
};

ko.applyBindingsToNode = function (node, bindings, viewModelOrBindingContext) {
var context = getBindingContext(viewModelOrBindingContext);
return ko.applyBindingAccessorsToNode(node, makeBindingAccessors(bindings, context, node), context);
};

ko.applyBindingsToDescendants = function(viewModelOrBindingContext, rootNode) {
if (rootNode.nodeType === 1 || rootNode.nodeType === 8)
applyBindingsToDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
};

ko.applyBindings = function (viewModelOrBindingContext, rootNode) {
if (rootNode && (rootNode.nodeType !== 1) && (rootNode.nodeType !== 8))
throw new Error("ko.applyBindings: first parameter should be your view model; second parameter should be a DOM node");
rootNode = rootNode || window.document.body;

applyBindingsToNodeAndDescendantsInternal(getBindingContext(viewModelOrBindingContext), rootNode, true);
};


ko.contextFor = function(node) {

switch (node.nodeType) {
case 1:
case 8:
var context = ko.storedBindingContextForNode(node);
if (context) return context;
if (node.parentNode) return ko.contextFor(node.parentNode);
break;
}
return undefined;
};
ko.dataFor = function(node) {
var context = ko.contextFor(node);
return context ? context['$data'] : undefined;
};

ko.exportSymbol('bindingHandlers', ko.bindingHandlers);
ko.exportSymbol('applyBindings', ko.applyBindings);
ko.exportSymbol('applyBindingsToDescendants', ko.applyBindingsToDescendants);
ko.exportSymbol('applyBindingAccessorsToNode', ko.applyBindingAccessorsToNode);
ko.exportSymbol('applyBindingsToNode', ko.applyBindingsToNode);
ko.exportSymbol('contextFor', ko.contextFor);
ko.exportSymbol('dataFor', ko.dataFor);
})();
var attrHtmlToJavascriptMap = { 'class': 'className', 'for': 'htmlFor' };
ko.bindingHandlers['attr'] = {
'update': function(element, valueAccessor, allBindings) {
var value = ko.utils.unwrapObservable(valueAccessor()) || {};
ko.utils.objectForEach(value, function(attrName, attrValue) {
attrValue = ko.utils.unwrapObservable(attrValue);




var toRemove = (attrValue === false) || (attrValue === null) || (attrValue === undefined);
if (toRemove)
element.removeAttribute(attrName);





if (ko.utils.ieVersion <= 8 && attrName in attrHtmlToJavascriptMap) {
attrName = attrHtmlToJavascriptMap[attrName];
if (toRemove)
element.removeAttribute(attrName);
else
element[attrName] = attrValue;
} else if (!toRemove) {
element.setAttribute(attrName, attrValue.toString());
}





if (attrName === "name") {
ko.utils.setElementName(element, toRemove ? "" : attrValue.toString());
}
});
}
};
(function() {

ko.bindingHandlers['checked'] = {
'after': ['value', 'attr'],
'init': function (element, valueAccessor, allBindings) {
function checkedValue() {
return allBindings['has']('checkedValue')
? ko.utils.unwrapObservable(allBindings.get('checkedValue'))
: element.value;
}

function updateModel() {


var isChecked = element.checked,
elemValue = useCheckedValue ? checkedValue() : isChecked;


if (!shouldSet) {
return;
}



if (isRadio && !isChecked) {
return;
}

var modelValue = ko.dependencyDetection.ignore(valueAccessor);
if (isValueArray) {
if (oldElemValue !== elemValue) {



if (isChecked) {
ko.utils.addOrRemoveItem(modelValue, elemValue, true);
ko.utils.addOrRemoveItem(modelValue, oldElemValue, false);
}

oldElemValue = elemValue;
} else {


ko.utils.addOrRemoveItem(modelValue, elemValue, isChecked);
}
} else {
ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'checked', elemValue, true);
}
};

function updateView() {


var modelValue = ko.utils.unwrapObservable(valueAccessor());

if (isValueArray) {

element.checked = ko.utils.arrayIndexOf(modelValue, checkedValue()) >= 0;
} else if (isCheckbox) {

element.checked = modelValue;
} else {

element.checked = (checkedValue() === modelValue);
}
};

var isCheckbox = element.type == "checkbox",
isRadio = element.type == "radio";


if (!isCheckbox && !isRadio) {
return;
}

var isValueArray = isCheckbox && (ko.utils.unwrapObservable(valueAccessor()) instanceof Array),
oldElemValue = isValueArray ? checkedValue() : undefined,
useCheckedValue = isRadio || isValueArray,
shouldSet = false;


if (isRadio && !element.name)
ko.bindingHandlers['uniqueName']['init'](element, function() { return true });




ko.dependentObservable(updateModel, null, { disposeWhenNodeIsRemoved: element });
ko.utils.registerEventHandler(element, "click", updateModel);


ko.dependentObservable(updateView, null, { disposeWhenNodeIsRemoved: element });

shouldSet = true;
}
};
ko.expressionRewriting.twoWayBindings['checked'] = true;

ko.bindingHandlers['checkedValue'] = {
'update': function (element, valueAccessor) {
element.value = ko.utils.unwrapObservable(valueAccessor());
}
};

})();var classesWrittenByBindingKey = '__ko__cssValue';
ko.bindingHandlers['css'] = {
'update': function (element, valueAccessor) {
var value = ko.utils.unwrapObservable(valueAccessor());
if (typeof value == "object") {
ko.utils.objectForEach(value, function(className, shouldHaveClass) {
shouldHaveClass = ko.utils.unwrapObservable(shouldHaveClass);
ko.utils.toggleDomNodeCssClass(element, className, shouldHaveClass);
});
} else {
value = String(value || '');
ko.utils.toggleDomNodeCssClass(element, element[classesWrittenByBindingKey], false);
element[classesWrittenByBindingKey] = value;
ko.utils.toggleDomNodeCssClass(element, value, true);
}
}
};
ko.bindingHandlers['enable'] = {
'update': function (element, valueAccessor) {
var value = ko.utils.unwrapObservable(valueAccessor());
if (value && element.disabled)
element.removeAttribute("disabled");
else if ((!value) && (!element.disabled))
element.disabled = true;
}
};

ko.bindingHandlers['disable'] = {
'update': function (element, valueAccessor) {
ko.bindingHandlers['enable']['update'](element, function() { return !ko.utils.unwrapObservable(valueAccessor()) });
}
};


function makeEventHandlerShortcut(eventName) {
ko.bindingHandlers[eventName] = {
'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
var newValueAccessor = function () {
var result = {};
result[eventName] = valueAccessor();
return result;
};
return ko.bindingHandlers['event']['init'].call(this, element, newValueAccessor, allBindings, viewModel, bindingContext);
}
}
}

ko.bindingHandlers['event'] = {
'init' : function (element, valueAccessor, allBindings, viewModel, bindingContext) {
var eventsToHandle = valueAccessor() || {};
ko.utils.objectForEach(eventsToHandle, function(eventName) {
if (typeof eventName == "string") {
ko.utils.registerEventHandler(element, eventName, function (event) {
var handlerReturnValue;
var handlerFunction = valueAccessor()[eventName];
if (!handlerFunction)
return;

try {

var argsForHandler = ko.utils.makeArray(arguments);
viewModel = bindingContext['$data'];
argsForHandler.unshift(viewModel);
handlerReturnValue = handlerFunction.apply(viewModel, argsForHandler);
} finally {
if (handlerReturnValue !== true) {
if (event.preventDefault)
event.preventDefault();
else
event.returnValue = false;
}
}

var bubble = allBindings.get(eventName + 'Bubble') !== false;
if (!bubble) {
event.cancelBubble = true;
if (event.stopPropagation)
event.stopPropagation();
}
});
}
});
}
};


ko.bindingHandlers['foreach'] = {
makeTemplateValueAccessor: function(valueAccessor) {
return function() {
var modelValue = valueAccessor(),
unwrappedValue = ko.utils.peekObservable(modelValue);




if ((!unwrappedValue) || typeof unwrappedValue.length == "number")
return { 'foreach': modelValue, 'templateEngine': ko.nativeTemplateEngine.instance };


ko.utils.unwrapObservable(modelValue);
return {
'foreach': unwrappedValue['data'],
'as': unwrappedValue['as'],
'includeDestroyed': unwrappedValue['includeDestroyed'],
'afterAdd': unwrappedValue['afterAdd'],
'beforeRemove': unwrappedValue['beforeRemove'],
'afterRender': unwrappedValue['afterRender'],
'beforeMove': unwrappedValue['beforeMove'],
'afterMove': unwrappedValue['afterMove'],
'templateEngine': ko.nativeTemplateEngine.instance
};
};
},
'init': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
return ko.bindingHandlers['template']['init'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor));
},
'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
return ko.bindingHandlers['template']['update'](element, ko.bindingHandlers['foreach'].makeTemplateValueAccessor(valueAccessor), allBindings, viewModel, bindingContext);
}
};
ko.expressionRewriting.bindingRewriteValidators['foreach'] = false;
ko.virtualElements.allowedBindings['foreach'] = true;
var hasfocusUpdatingProperty = '__ko_hasfocusUpdating';
var hasfocusLastValue = '__ko_hasfocusLastValue';
ko.bindingHandlers['hasfocus'] = {
'init': function(element, valueAccessor, allBindings) {
var handleElementFocusChange = function(isFocused) {






element[hasfocusUpdatingProperty] = true;
var ownerDoc = element.ownerDocument;
if ("activeElement" in ownerDoc) {
var active;
try {
active = ownerDoc.activeElement;
} catch(e) {

active = ownerDoc.body;
}
isFocused = (active === element);
}
var modelValue = valueAccessor();
ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'hasfocus', isFocused, true);


element[hasfocusLastValue] = isFocused;
element[hasfocusUpdatingProperty] = false;
};
var handleElementFocusIn = handleElementFocusChange.bind(null, true);
var handleElementFocusOut = handleElementFocusChange.bind(null, false);

ko.utils.registerEventHandler(element, "focus", handleElementFocusIn);
ko.utils.registerEventHandler(element, "focusin", handleElementFocusIn);
ko.utils.registerEventHandler(element, "blur",  handleElementFocusOut);
ko.utils.registerEventHandler(element, "focusout",  handleElementFocusOut);
},
'update': function(element, valueAccessor) {
var value = !!ko.utils.unwrapObservable(valueAccessor());
if (!element[hasfocusUpdatingProperty] && element[hasfocusLastValue] !== value) {
value ? element.focus() : element.blur();
ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, value ? "focusin" : "focusout"]);
}
}
};
ko.expressionRewriting.twoWayBindings['hasfocus'] = true;

ko.bindingHandlers['hasFocus'] = ko.bindingHandlers['hasfocus'];
ko.expressionRewriting.twoWayBindings['hasFocus'] = true;
ko.bindingHandlers['html'] = {
'init': function() {

return { 'controlsDescendantBindings': true };
},
'update': function (element, valueAccessor) {

ko.utils.setHtml(element, valueAccessor());
}
};
var withIfDomDataKey = ko.utils.domData.nextKey();

function makeWithIfBinding(bindingKey, isWith, isNot, makeContextCallback) {
ko.bindingHandlers[bindingKey] = {
'init': function(element) {
ko.utils.domData.set(element, withIfDomDataKey, {});
return { 'controlsDescendantBindings': true };
},
'update': function(element, valueAccessor, allBindings, viewModel, bindingContext) {
var withIfData = ko.utils.domData.get(element, withIfDomDataKey),
dataValue = ko.utils.unwrapObservable(valueAccessor()),
shouldDisplay = !isNot !== !dataValue,
isFirstRender = !withIfData.savedNodes,
needsRefresh = isFirstRender || isWith || (shouldDisplay !== withIfData.didDisplayOnLastUpdate);

if (needsRefresh) {
if (isFirstRender) {
withIfData.savedNodes = ko.utils.cloneNodes(ko.virtualElements.childNodes(element), true  );
}

if (shouldDisplay) {
if (!isFirstRender) {
ko.virtualElements.setDomNodeChildren(element, ko.utils.cloneNodes(withIfData.savedNodes));
}
ko.applyBindingsToDescendants(makeContextCallback ? makeContextCallback(bindingContext, dataValue) : bindingContext, element);
} else {
ko.virtualElements.emptyNode(element);
}

withIfData.didDisplayOnLastUpdate = shouldDisplay;
}
}
};
ko.expressionRewriting.bindingRewriteValidators[bindingKey] = false;
ko.virtualElements.allowedBindings[bindingKey] = true;
}


makeWithIfBinding('if');
makeWithIfBinding('ifnot', false  , true  );
makeWithIfBinding('with', true  , false  ,
function(bindingContext, dataValue) {
return bindingContext['createChildContext'](dataValue);
}
);
ko.bindingHandlers['options'] = {
'init': function(element) {
if (ko.utils.tagNameLower(element) !== "select")
throw new Error("options binding applies only to SELECT elements");


while (element.length > 0) {
element.remove(0);
}


return { 'controlsDescendantBindings': true };
},
'update': function (element, valueAccessor, allBindings) {
function selectedOptions() {
return ko.utils.arrayFilter(element.options, function (node) { return node.selected; });
}

var selectWasPreviouslyEmpty = element.length == 0;
var previousScrollTop = (!selectWasPreviouslyEmpty && element.multiple) ? element.scrollTop : null;

var unwrappedArray = ko.utils.unwrapObservable(valueAccessor());
var includeDestroyed = allBindings.get('optionsIncludeDestroyed');
var captionPlaceholder = {};
var captionValue;
var previousSelectedValues;
if (element.multiple) {
previousSelectedValues = ko.utils.arrayMap(selectedOptions(), ko.selectExtensions.readValue);
} else {
previousSelectedValues = element.selectedIndex >= 0 ? [ ko.selectExtensions.readValue(element.options[element.selectedIndex]) ] : [];
}

if (unwrappedArray) {
if (typeof unwrappedArray.length == "undefined")
unwrappedArray = [unwrappedArray];


var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
return includeDestroyed || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
});


if (allBindings['has']('optionsCaption')) {
captionValue = ko.utils.unwrapObservable(allBindings.get('optionsCaption'));

if (captionValue !== null && captionValue !== undefined) {
filteredArray.unshift(captionPlaceholder);
}
}
} else {

unwrappedArray = [];
}

function applyToObject(object, predicate, defaultValue) {
var predicateType = typeof predicate;
if (predicateType == "function")
return predicate(object);
else if (predicateType == "string")
return object[predicate];
else
return defaultValue;
}





var itemUpdate = false;
function optionForArrayItem(arrayEntry, index, oldOptions) {
if (oldOptions.length) {
previousSelectedValues = oldOptions[0].selected ? [ ko.selectExtensions.readValue(oldOptions[0]) ] : [];
itemUpdate = true;
}
var option = document.createElement("option");
if (arrayEntry === captionPlaceholder) {
ko.utils.setTextContent(option, allBindings.get('optionsCaption'));
ko.selectExtensions.writeValue(option, undefined);
} else {

var optionValue = applyToObject(arrayEntry, allBindings.get('optionsValue'), arrayEntry);
ko.selectExtensions.writeValue(option, ko.utils.unwrapObservable(optionValue));


var optionText = applyToObject(arrayEntry, allBindings.get('optionsText'), optionValue);
ko.utils.setTextContent(option, optionText);
}
return [option];
}

function setSelectionCallback(arrayEntry, newOptions) {


if (previousSelectedValues.length) {
var isSelected = ko.utils.arrayIndexOf(previousSelectedValues, ko.selectExtensions.readValue(newOptions[0])) >= 0;
ko.utils.setOptionNodeSelectionState(newOptions[0], isSelected);


if (itemUpdate && !isSelected)
ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
}
}

var callback = setSelectionCallback;
if (allBindings['has']('optionsAfterRender')) {
callback = function(arrayEntry, newOptions) {
setSelectionCallback(arrayEntry, newOptions);
ko.dependencyDetection.ignore(allBindings.get('optionsAfterRender'), null, [newOptions[0], arrayEntry !== captionPlaceholder ? arrayEntry : undefined]);
}
}

ko.utils.setDomNodeChildrenFromArrayMapping(element, filteredArray, optionForArrayItem, null, callback);


var selectionChanged;
if (element.multiple) {


selectionChanged = previousSelectedValues.length && selectedOptions().length < previousSelectedValues.length;
} else {


selectionChanged = (previousSelectedValues.length && element.selectedIndex >= 0)
? (ko.selectExtensions.readValue(element.options[element.selectedIndex]) !== previousSelectedValues[0])
: (previousSelectedValues.length || element.selectedIndex >= 0);
}




if (selectionChanged)
ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);


ko.utils.ensureSelectElementIsRenderedCorrectly(element);

if (previousScrollTop && Math.abs(previousScrollTop - element.scrollTop) > 20)
element.scrollTop = previousScrollTop;
}
};
ko.bindingHandlers['options'].optionValueDomDataKey = ko.utils.domData.nextKey();
ko.bindingHandlers['selectedOptions'] = {
'after': ['options', 'foreach'],
'init': function (element, valueAccessor, allBindings) {
ko.utils.registerEventHandler(element, "change", function () {
var value = valueAccessor(), valueToWrite = [];
ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
if (node.selected)
valueToWrite.push(ko.selectExtensions.readValue(node));
});
ko.expressionRewriting.writeValueToProperty(value, allBindings, 'selectedOptions', valueToWrite);
});
},
'update': function (element, valueAccessor) {
if (ko.utils.tagNameLower(element) != "select")
throw new Error("values binding applies only to SELECT elements");

var newValue = ko.utils.unwrapObservable(valueAccessor());
if (newValue && typeof newValue.length == "number") {
ko.utils.arrayForEach(element.getElementsByTagName("option"), function(node) {
var isSelected = ko.utils.arrayIndexOf(newValue, ko.selectExtensions.readValue(node)) >= 0;
ko.utils.setOptionNodeSelectionState(node, isSelected);
});
}
}
};
ko.expressionRewriting.twoWayBindings['selectedOptions'] = true;
ko.bindingHandlers['style'] = {
'update': function (element, valueAccessor) {
var value = ko.utils.unwrapObservable(valueAccessor() || {});
ko.utils.objectForEach(value, function(styleName, styleValue) {
styleValue = ko.utils.unwrapObservable(styleValue);
element.style[styleName] = styleValue || "";
});
}
};
ko.bindingHandlers['submit'] = {
'init': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
if (typeof valueAccessor() != "function")
throw new Error("The value for a submit binding must be a function");
ko.utils.registerEventHandler(element, "submit", function (event) {
var handlerReturnValue;
var value = valueAccessor();
try { handlerReturnValue = value.call(bindingContext['$data'], element); }
finally {
if (handlerReturnValue !== true) {
if (event.preventDefault)
event.preventDefault();
else
event.returnValue = false;
}
}
});
}
};
ko.bindingHandlers['text'] = {
'init': function() {


return { 'controlsDescendantBindings': true };
},
'update': function (element, valueAccessor) {
ko.utils.setTextContent(element, valueAccessor());
}
};
ko.virtualElements.allowedBindings['text'] = true;
ko.bindingHandlers['uniqueName'] = {
'init': function (element, valueAccessor) {
if (valueAccessor()) {
var name = "ko_unique_" + (++ko.bindingHandlers['uniqueName'].currentIndex);
ko.utils.setElementName(element, name);
}
}
};
ko.bindingHandlers['uniqueName'].currentIndex = 0;
ko.bindingHandlers['value'] = {
'after': ['options', 'foreach'],
'init': function (element, valueAccessor, allBindings) {

var eventsToCatch = ["change"];
var requestedEventsToCatch = allBindings.get("valueUpdate");
var propertyChangedFired = false;
if (requestedEventsToCatch) {
if (typeof requestedEventsToCatch == "string")
requestedEventsToCatch = [requestedEventsToCatch];
ko.utils.arrayPushAll(eventsToCatch, requestedEventsToCatch);
eventsToCatch = ko.utils.arrayGetDistinctValues(eventsToCatch);
}

var valueUpdateHandler = function() {
propertyChangedFired = false;
var modelValue = valueAccessor();
var elementValue = ko.selectExtensions.readValue(element);
ko.expressionRewriting.writeValueToProperty(modelValue, allBindings, 'value', elementValue);
}



var ieAutoCompleteHackNeeded = ko.utils.ieVersion && element.tagName.toLowerCase() == "input" && element.type == "text"
&& element.autocomplete != "off" && (!element.form || element.form.autocomplete != "off");
if (ieAutoCompleteHackNeeded && ko.utils.arrayIndexOf(eventsToCatch, "propertychange") == -1) {
ko.utils.registerEventHandler(element, "propertychange", function () { propertyChangedFired = true });
ko.utils.registerEventHandler(element, "blur", function() {
if (propertyChangedFired) {
valueUpdateHandler();
}
});
}

ko.utils.arrayForEach(eventsToCatch, function(eventName) {



var handler = valueUpdateHandler;
if (ko.utils.stringStartsWith(eventName, "after")) {
handler = function() { setTimeout(valueUpdateHandler, 0) };
eventName = eventName.substring("after".length);
}
ko.utils.registerEventHandler(element, eventName, handler);
});
},
'update': function (element, valueAccessor) {
var valueIsSelectOption = ko.utils.tagNameLower(element) === "select";
var newValue = ko.utils.unwrapObservable(valueAccessor());
var elementValue = ko.selectExtensions.readValue(element);
var valueHasChanged = (newValue !== elementValue);

if (valueHasChanged) {
var applyValueAction = function () { ko.selectExtensions.writeValue(element, newValue); };
applyValueAction();

if (valueIsSelectOption) {
if (newValue !== ko.selectExtensions.readValue(element)) {


ko.dependencyDetection.ignore(ko.utils.triggerEvent, null, [element, "change"]);
} else {



setTimeout(applyValueAction, 0);
}
}
}
}
};
ko.expressionRewriting.twoWayBindings['value'] = true;
ko.bindingHandlers['visible'] = {
'update': function (element, valueAccessor) {
var value = ko.utils.unwrapObservable(valueAccessor());
var isCurrentlyVisible = !(element.style.display == "none");
if (value && !isCurrentlyVisible)
element.style.display = "";
else if ((!value) && isCurrentlyVisible)
element.style.display = "none";
}
};

makeEventHandlerShortcut('click');


























ko.templateEngine = function () { };

ko.templateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
throw new Error("Override renderTemplateSource");
};

ko.templateEngine.prototype['createJavaScriptEvaluatorBlock'] = function (script) {
throw new Error("Override createJavaScriptEvaluatorBlock");
};

ko.templateEngine.prototype['makeTemplateSource'] = function(template, templateDocument) {

if (typeof template == "string") {
templateDocument = templateDocument || document;
var elem = templateDocument.getElementById(template);
if (!elem)
throw new Error("Cannot find template with ID " + template);
return new ko.templateSources.domElement(elem);
} else if ((template.nodeType == 1) || (template.nodeType == 8)) {

return new ko.templateSources.anonymousTemplate(template);
} else
throw new Error("Unknown template type: " + template);
};

ko.templateEngine.prototype['renderTemplate'] = function (template, bindingContext, options, templateDocument) {
var templateSource = this['makeTemplateSource'](template, templateDocument);
return this['renderTemplateSource'](templateSource, bindingContext, options);
};

ko.templateEngine.prototype['isTemplateRewritten'] = function (template, templateDocument) {

if (this['allowTemplateRewriting'] === false)
return true;
return this['makeTemplateSource'](template, templateDocument)['data']("isRewritten");
};

ko.templateEngine.prototype['rewriteTemplate'] = function (template, rewriterCallback, templateDocument) {
var templateSource = this['makeTemplateSource'](template, templateDocument);
var rewritten = rewriterCallback(templateSource['text']());
templateSource['text'](rewritten);
templateSource['data']("isRewritten", true);
};

ko.exportSymbol('templateEngine', ko.templateEngine);

ko.templateRewriting = (function () {
var memoizeDataBindingAttributeSyntaxRegex = /(<([a-z]+\d*)(?:\s+(?!data-bind\s*=\s*)[a-z0-9\-]+(?:=(?:\"[^\"]*\"|\'[^\']*\'))?)*\s+)data-bind\s*=\s*(["'])([\s\S]*?)\3/gi;
var memoizeVirtualContainerBindingSyntaxRegex = /<!--\s*ko\b\s*([\s\S]*?)\s*-->/g;

function validateDataBindValuesForRewriting(keyValueArray) {
var allValidators = ko.expressionRewriting.bindingRewriteValidators;
for (var i = 0; i < keyValueArray.length; i++) {
var key = keyValueArray[i]['key'];
if (allValidators.hasOwnProperty(key)) {
var validator = allValidators[key];

if (typeof validator === "function") {
var possibleErrorMessage = validator(keyValueArray[i]['value']);
if (possibleErrorMessage)
throw new Error(possibleErrorMessage);
} else if (!validator) {
throw new Error("This template engine does not support the '" + key + "' binding within its templates");
}
}
}
}

function constructMemoizedTagReplacement(dataBindAttributeValue, tagToRetain, nodeName, templateEngine) {
var dataBindKeyValueArray = ko.expressionRewriting.parseObjectLiteral(dataBindAttributeValue);
validateDataBindValuesForRewriting(dataBindKeyValueArray);
var rewrittenDataBindAttributeValue = ko.expressionRewriting.preProcessBindings(dataBindKeyValueArray, {'valueAccessors':true});

// For no obvious reason, Opera fails to evaluate rewrittenDataBindAttributeValue unless it's wrapped in an additional


var applyBindingsToNextSiblingScript =
"ko.__tr_ambtns(function($context,$element){return(function(){return{ " + rewrittenDataBindAttributeValue + " } })()},'" + nodeName.toLowerCase() + "')";
return templateEngine['createJavaScriptEvaluatorBlock'](applyBindingsToNextSiblingScript) + tagToRetain;
}

return {
ensureTemplateIsRewritten: function (template, templateEngine, templateDocument) {
if (!templateEngine['isTemplateRewritten'](template, templateDocument))
templateEngine['rewriteTemplate'](template, function (htmlString) {
return ko.templateRewriting.memoizeBindingAttributeSyntax(htmlString, templateEngine);
}, templateDocument);
},

memoizeBindingAttributeSyntax: function (htmlString, templateEngine) {
return htmlString.replace(memoizeDataBindingAttributeSyntaxRegex, function () {
return constructMemoizedTagReplacement(  arguments[4],   arguments[1],   arguments[2], templateEngine);
}).replace(memoizeVirtualContainerBindingSyntaxRegex, function() {
return constructMemoizedTagReplacement(  arguments[1],   "<!-- ko -->",   "#comment", templateEngine);
});
},

applyMemoizedBindingsToNextSibling: function (bindings, nodeName) {
return ko.memoization.memoize(function (domNode, bindingContext) {
var nodeToBind = domNode.nextSibling;
if (nodeToBind && nodeToBind.nodeName.toLowerCase() === nodeName) {
ko.applyBindingAccessorsToNode(nodeToBind, bindings, bindingContext);
}
});
}
}
})();



ko.exportSymbol('__tr_ambtns', ko.templateRewriting.applyMemoizedBindingsToNextSibling);
(function() {
























ko.templateSources = {};



ko.templateSources.domElement = function(element) {
this.domElement = element;
}

ko.templateSources.domElement.prototype['text'] = function( ) {
var tagNameLower = ko.utils.tagNameLower(this.domElement),
elemContentsProperty = tagNameLower === "script" ? "text"
: tagNameLower === "textarea" ? "value"
: "innerHTML";

if (arguments.length == 0) {
return this.domElement[elemContentsProperty];
} else {
var valueToWrite = arguments[0];
if (elemContentsProperty === "innerHTML")
ko.utils.setHtml(this.domElement, valueToWrite);
else
this.domElement[elemContentsProperty] = valueToWrite;
}
};

var dataDomDataPrefix = ko.utils.domData.nextKey() + "_";
ko.templateSources.domElement.prototype['data'] = function(key  ) {
if (arguments.length === 1) {
return ko.utils.domData.get(this.domElement, dataDomDataPrefix + key);
} else {
ko.utils.domData.set(this.domElement, dataDomDataPrefix + key, arguments[1]);
}
};






var anonymousTemplatesDomDataKey = ko.utils.domData.nextKey();
ko.templateSources.anonymousTemplate = function(element) {
this.domElement = element;
}
ko.templateSources.anonymousTemplate.prototype = new ko.templateSources.domElement();
ko.templateSources.anonymousTemplate.prototype.constructor = ko.templateSources.anonymousTemplate;
ko.templateSources.anonymousTemplate.prototype['text'] = function( ) {
if (arguments.length == 0) {
var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
if (templateData.textData === undefined && templateData.containerData)
templateData.textData = templateData.containerData.innerHTML;
return templateData.textData;
} else {
var valueToWrite = arguments[0];
ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {textData: valueToWrite});
}
};
ko.templateSources.domElement.prototype['nodes'] = function( ) {
if (arguments.length == 0) {
var templateData = ko.utils.domData.get(this.domElement, anonymousTemplatesDomDataKey) || {};
return templateData.containerData;
} else {
var valueToWrite = arguments[0];
ko.utils.domData.set(this.domElement, anonymousTemplatesDomDataKey, {containerData: valueToWrite});
}
};

ko.exportSymbol('templateSources', ko.templateSources);
ko.exportSymbol('templateSources.domElement', ko.templateSources.domElement);
ko.exportSymbol('templateSources.anonymousTemplate', ko.templateSources.anonymousTemplate);
})();
(function () {
var _templateEngine;
ko.setTemplateEngine = function (templateEngine) {
if ((templateEngine != undefined) && !(templateEngine instanceof ko.templateEngine))
throw new Error("templateEngine must inherit from ko.templateEngine");
_templateEngine = templateEngine;
}

function invokeForEachNodeInContinuousRange(firstNode, lastNode, action) {
var node, nextInQueue = firstNode, firstOutOfRangeNode = ko.virtualElements.nextSibling(lastNode);
while (nextInQueue && ((node = nextInQueue) !== firstOutOfRangeNode)) {
nextInQueue = ko.virtualElements.nextSibling(node);
action(node, nextInQueue);
}
}

function activateBindingsOnContinuousNodeArray(continuousNodeArray, bindingContext) {






if (continuousNodeArray.length) {
var firstNode = continuousNodeArray[0],
lastNode = continuousNodeArray[continuousNodeArray.length - 1],
parentNode = firstNode.parentNode,
provider = ko.bindingProvider['instance'],
preprocessNode = provider['preprocessNode'];

if (preprocessNode) {
invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node, nextNodeInRange) {
var nodePreviousSibling = node.previousSibling;
var newNodes = preprocessNode.call(provider, node);
if (newNodes) {
if (node === firstNode)
firstNode = newNodes[0] || nextNodeInRange;
if (node === lastNode)
lastNode = newNodes[newNodes.length - 1] || nodePreviousSibling;
}
});




continuousNodeArray.length = 0;
if (!firstNode) {
return;
}
if (firstNode === lastNode) {
continuousNodeArray.push(firstNode);
} else {
continuousNodeArray.push(firstNode, lastNode);
ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
}
}



invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
if (node.nodeType === 1 || node.nodeType === 8)
ko.applyBindings(bindingContext, node);
});
invokeForEachNodeInContinuousRange(firstNode, lastNode, function(node) {
if (node.nodeType === 1 || node.nodeType === 8)
ko.memoization.unmemoizeDomNodeAndDescendants(node, [bindingContext]);
});


ko.utils.fixUpContinuousNodeArray(continuousNodeArray, parentNode);
}
}

function getFirstNodeFromPossibleArray(nodeOrNodeArray) {
return nodeOrNodeArray.nodeType ? nodeOrNodeArray
: nodeOrNodeArray.length > 0 ? nodeOrNodeArray[0]
: null;
}

function executeTemplate(targetNodeOrNodeArray, renderMode, template, bindingContext, options) {
options = options || {};
var firstTargetNode = targetNodeOrNodeArray && getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
var templateDocument = firstTargetNode && firstTargetNode.ownerDocument;
var templateEngineToUse = (options['templateEngine'] || _templateEngine);
ko.templateRewriting.ensureTemplateIsRewritten(template, templateEngineToUse, templateDocument);
var renderedNodesArray = templateEngineToUse['renderTemplate'](template, bindingContext, options, templateDocument);


if ((typeof renderedNodesArray.length != "number") || (renderedNodesArray.length > 0 && typeof renderedNodesArray[0].nodeType != "number"))
throw new Error("Template engine must return an array of DOM nodes");

var haveAddedNodesToParent = false;
switch (renderMode) {
case "replaceChildren":
ko.virtualElements.setDomNodeChildren(targetNodeOrNodeArray, renderedNodesArray);
haveAddedNodesToParent = true;
break;
case "replaceNode":
ko.utils.replaceDomNodes(targetNodeOrNodeArray, renderedNodesArray);
haveAddedNodesToParent = true;
break;
case "ignoreTargetNode": break;
default:
throw new Error("Unknown renderMode: " + renderMode);
}

if (haveAddedNodesToParent) {
activateBindingsOnContinuousNodeArray(renderedNodesArray, bindingContext);
if (options['afterRender'])
ko.dependencyDetection.ignore(options['afterRender'], null, [renderedNodesArray, bindingContext['$data']]);
}

return renderedNodesArray;
}

ko.renderTemplate = function (template, dataOrBindingContext, options, targetNodeOrNodeArray, renderMode) {
options = options || {};
if ((options['templateEngine'] || _templateEngine) == undefined)
throw new Error("Set a template engine before calling renderTemplate");
renderMode = renderMode || "replaceChildren";

if (targetNodeOrNodeArray) {
var firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);

var whenToDispose = function () { return (!firstTargetNode) || !ko.utils.domNodeIsAttachedToDocument(firstTargetNode); };
var activelyDisposeWhenNodeIsRemoved = (firstTargetNode && renderMode == "replaceNode") ? firstTargetNode.parentNode : firstTargetNode;

return ko.dependentObservable(
function () {

var bindingContext = (dataOrBindingContext && (dataOrBindingContext instanceof ko.bindingContext))
? dataOrBindingContext
: new ko.bindingContext(ko.utils.unwrapObservable(dataOrBindingContext));


var templateName = typeof(template) == 'function' ? template(bindingContext['$data'], bindingContext) : template;

var renderedNodesArray = executeTemplate(targetNodeOrNodeArray, renderMode, templateName, bindingContext, options);
if (renderMode == "replaceNode") {
targetNodeOrNodeArray = renderedNodesArray;
firstTargetNode = getFirstNodeFromPossibleArray(targetNodeOrNodeArray);
}
},
null,
{ disposeWhen: whenToDispose, disposeWhenNodeIsRemoved: activelyDisposeWhenNodeIsRemoved }
);
} else {

return ko.memoization.memoize(function (domNode) {
ko.renderTemplate(template, dataOrBindingContext, options, domNode, "replaceNode");
});
}
};

ko.renderTemplateForEach = function (template, arrayOrObservableArray, options, targetNode, parentBindingContext) {


var arrayItemContext;


var executeTemplateForArrayItem = function (arrayValue, index) {

arrayItemContext = parentBindingContext['createChildContext'](arrayValue, options['as'], function(context) {
context['$index'] = index;
});
var templateName = typeof(template) == 'function' ? template(arrayValue, arrayItemContext) : template;
return executeTemplate(null, "ignoreTargetNode", templateName, arrayItemContext, options);
}


var activateBindingsCallback = function(arrayValue, addedNodesArray, index) {
activateBindingsOnContinuousNodeArray(addedNodesArray, arrayItemContext);
if (options['afterRender'])
options['afterRender'](addedNodesArray, arrayValue);
};

return ko.dependentObservable(function () {
var unwrappedArray = ko.utils.unwrapObservable(arrayOrObservableArray) || [];
if (typeof unwrappedArray.length == "undefined")
unwrappedArray = [unwrappedArray];


var filteredArray = ko.utils.arrayFilter(unwrappedArray, function(item) {
return options['includeDestroyed'] || item === undefined || item === null || !ko.utils.unwrapObservable(item['_destroy']);
});



ko.dependencyDetection.ignore(ko.utils.setDomNodeChildrenFromArrayMapping, null, [targetNode, filteredArray, executeTemplateForArrayItem, options, activateBindingsCallback]);

}, null, { disposeWhenNodeIsRemoved: targetNode });
};

var templateComputedDomDataKey = ko.utils.domData.nextKey();
function disposeOldComputedAndStoreNewOne(element, newComputed) {
var oldComputed = ko.utils.domData.get(element, templateComputedDomDataKey);
if (oldComputed && (typeof(oldComputed.dispose) == 'function'))
oldComputed.dispose();
ko.utils.domData.set(element, templateComputedDomDataKey, (newComputed && newComputed.isActive()) ? newComputed : undefined);
}

ko.bindingHandlers['template'] = {
'init': function(element, valueAccessor) {

var bindingValue = ko.utils.unwrapObservable(valueAccessor());
if (typeof bindingValue == "string" || bindingValue['name']) {

ko.virtualElements.emptyNode(element);
} else {

var templateNodes = ko.virtualElements.childNodes(element),
container = ko.utils.moveCleanedNodesToContainerElement(templateNodes);
new ko.templateSources.anonymousTemplate(element)['nodes'](container);
}
return { 'controlsDescendantBindings': true };
},
'update': function (element, valueAccessor, allBindings, viewModel, bindingContext) {
var templateName = ko.utils.unwrapObservable(valueAccessor()),
options = {},
shouldDisplay = true,
dataValue,
templateComputed = null;

if (typeof templateName != "string") {
options = templateName;
templateName = ko.utils.unwrapObservable(options['name']);


if ('if' in options)
shouldDisplay = ko.utils.unwrapObservable(options['if']);
if (shouldDisplay && 'ifnot' in options)
shouldDisplay = !ko.utils.unwrapObservable(options['ifnot']);

dataValue = ko.utils.unwrapObservable(options['data']);
}

if ('foreach' in options) {

var dataArray = (shouldDisplay && options['foreach']) || [];
templateComputed = ko.renderTemplateForEach(templateName || element, dataArray, options, element, bindingContext);
} else if (!shouldDisplay) {
ko.virtualElements.emptyNode(element);
} else {

var innerBindingContext = ('data' in options) ?
bindingContext['createChildContext'](dataValue, options['as']) :
bindingContext;
templateComputed = ko.renderTemplate(templateName || element, innerBindingContext, options, element);
}


disposeOldComputedAndStoreNewOne(element, templateComputed);
}
};


ko.expressionRewriting.bindingRewriteValidators['template'] = function(bindingValue) {
var parsedBindingValue = ko.expressionRewriting.parseObjectLiteral(bindingValue);

if ((parsedBindingValue.length == 1) && parsedBindingValue[0]['unknown'])
return null;

if (ko.expressionRewriting.keyValueArrayContainsKey(parsedBindingValue, "name"))
return null;
return "This template engine does not support anonymous templates nested within its templates";
};

ko.virtualElements.allowedBindings['template'] = true;
})();

ko.exportSymbol('setTemplateEngine', ko.setTemplateEngine);
ko.exportSymbol('renderTemplate', ko.renderTemplate);

ko.utils.compareArrays = (function () {
var statusNotInOld = 'added', statusNotInNew = 'deleted';


function compareArrays(oldArray, newArray, options) {


options = (typeof options === 'boolean') ? { 'dontLimitMoves': options } : (options || {});
oldArray = oldArray || [];
newArray = newArray || [];

if (oldArray.length <= newArray.length)
return compareSmallArrayToBigArray(oldArray, newArray, statusNotInOld, statusNotInNew, options);
else
return compareSmallArrayToBigArray(newArray, oldArray, statusNotInNew, statusNotInOld, options);
}

function compareSmallArrayToBigArray(smlArray, bigArray, statusNotInSml, statusNotInBig, options) {
var myMin = Math.min,
myMax = Math.max,
editDistanceMatrix = [],
smlIndex, smlIndexMax = smlArray.length,
bigIndex, bigIndexMax = bigArray.length,
compareRange = (bigIndexMax - smlIndexMax) || 1,
maxDistance = smlIndexMax + bigIndexMax + 1,
thisRow, lastRow,
bigIndexMaxForRow, bigIndexMinForRow;

for (smlIndex = 0; smlIndex <= smlIndexMax; smlIndex++) {
lastRow = thisRow;
editDistanceMatrix.push(thisRow = []);
bigIndexMaxForRow = myMin(bigIndexMax, smlIndex + compareRange);
bigIndexMinForRow = myMax(0, smlIndex - 1);
for (bigIndex = bigIndexMinForRow; bigIndex <= bigIndexMaxForRow; bigIndex++) {
if (!bigIndex)
thisRow[bigIndex] = smlIndex + 1;
else if (!smlIndex)
thisRow[bigIndex] = bigIndex + 1;
else if (smlArray[smlIndex - 1] === bigArray[bigIndex - 1])
thisRow[bigIndex] = lastRow[bigIndex - 1];
else {
var northDistance = lastRow[bigIndex] || maxDistance;
var westDistance = thisRow[bigIndex - 1] || maxDistance;
thisRow[bigIndex] = myMin(northDistance, westDistance) + 1;
}
}
}

var editScript = [], meMinusOne, notInSml = [], notInBig = [];
for (smlIndex = smlIndexMax, bigIndex = bigIndexMax; smlIndex || bigIndex;) {
meMinusOne = editDistanceMatrix[smlIndex][bigIndex] - 1;
if (bigIndex && meMinusOne === editDistanceMatrix[smlIndex][bigIndex-1]) {
notInSml.push(editScript[editScript.length] = {
'status': statusNotInSml,
'value': bigArray[--bigIndex],
'index': bigIndex });
} else if (smlIndex && meMinusOne === editDistanceMatrix[smlIndex - 1][bigIndex]) {
notInBig.push(editScript[editScript.length] = {
'status': statusNotInBig,
'value': smlArray[--smlIndex],
'index': smlIndex });
} else {
--bigIndex;
--smlIndex;
if (!options['sparse']) {
editScript.push({
'status': "retained",
'value': bigArray[bigIndex] });
}
}
}

if (notInSml.length && notInBig.length) {


var limitFailedCompares = smlIndexMax * 10, failedCompares,
a, d, notInSmlItem, notInBigItem;

for (failedCompares = a = 0; (options['dontLimitMoves'] || failedCompares < limitFailedCompares) && (notInSmlItem = notInSml[a]); a++) {
for (d = 0; notInBigItem = notInBig[d]; d++) {
if (notInSmlItem['value'] === notInBigItem['value']) {
notInSmlItem['moved'] = notInBigItem['index'];
notInBigItem['moved'] = notInSmlItem['index'];
notInBig.splice(d,1);
failedCompares = d = 0;
break;
}
}
failedCompares += d;
}
}
return editScript.reverse();
}

return compareArrays;
})();

ko.exportSymbol('utils.compareArrays', ko.utils.compareArrays);

(function () {










function mapNodeAndRefreshWhenChanged(containerNode, mapping, valueToMap, callbackAfterAddingNodes, index) {

var mappedNodes = [];
var dependentObservable = ko.dependentObservable(function() {
var newMappedNodes = mapping(valueToMap, index, ko.utils.fixUpContinuousNodeArray(mappedNodes, containerNode)) || [];


if (mappedNodes.length > 0) {
ko.utils.replaceDomNodes(mappedNodes, newMappedNodes);
if (callbackAfterAddingNodes)
ko.dependencyDetection.ignore(callbackAfterAddingNodes, null, [valueToMap, newMappedNodes, index]);
}



mappedNodes.splice(0, mappedNodes.length);
ko.utils.arrayPushAll(mappedNodes, newMappedNodes);
}, null, { disposeWhenNodeIsRemoved: containerNode, disposeWhen: function() { return !ko.utils.anyDomNodeIsAttachedToDocument(mappedNodes); } });
return { mappedNodes : mappedNodes, dependentObservable : (dependentObservable.isActive() ? dependentObservable : undefined) };
}

var lastMappingResultDomDataKey = ko.utils.domData.nextKey();

ko.utils.setDomNodeChildrenFromArrayMapping = function (domNode, array, mapping, options, callbackAfterAddingNodes) {

array = array || [];
options = options || {};
var isFirstExecution = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) === undefined;
var lastMappingResult = ko.utils.domData.get(domNode, lastMappingResultDomDataKey) || [];
var lastArray = ko.utils.arrayMap(lastMappingResult, function (x) { return x.arrayEntry; });
var editScript = ko.utils.compareArrays(lastArray, array, options['dontLimitMoves']);


var newMappingResult = [];
var lastMappingResultIndex = 0;
var newMappingResultIndex = 0;

var nodesToDelete = [];
var itemsToProcess = [];
var itemsForBeforeRemoveCallbacks = [];
var itemsForMoveCallbacks = [];
var itemsForAfterAddCallbacks = [];
var mapData;

function itemMovedOrRetained(editScriptIndex, oldPosition) {
mapData = lastMappingResult[oldPosition];
if (newMappingResultIndex !== oldPosition)
itemsForMoveCallbacks[editScriptIndex] = mapData;

mapData.indexObservable(newMappingResultIndex++);
ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode);
newMappingResult.push(mapData);
itemsToProcess.push(mapData);
}

function callCallback(callback, items) {
if (callback) {
for (var i = 0, n = items.length; i < n; i++) {
if (items[i]) {
ko.utils.arrayForEach(items[i].mappedNodes, function(node) {
callback(node, i, items[i].arrayEntry);
});
}
}
}
}

for (var i = 0, editScriptItem, movedIndex; editScriptItem = editScript[i]; i++) {
movedIndex = editScriptItem['moved'];
switch (editScriptItem['status']) {
case "deleted":
if (movedIndex === undefined) {
mapData = lastMappingResult[lastMappingResultIndex];


if (mapData.dependentObservable)
mapData.dependentObservable.dispose();


nodesToDelete.push.apply(nodesToDelete, ko.utils.fixUpContinuousNodeArray(mapData.mappedNodes, domNode));
if (options['beforeRemove']) {
itemsForBeforeRemoveCallbacks[i] = mapData;
itemsToProcess.push(mapData);
}
}
lastMappingResultIndex++;
break;

case "retained":
itemMovedOrRetained(i, lastMappingResultIndex++);
break;

case "added":
if (movedIndex !== undefined) {
itemMovedOrRetained(i, movedIndex);
} else {
mapData = { arrayEntry: editScriptItem['value'], indexObservable: ko.observable(newMappingResultIndex++) };
newMappingResult.push(mapData);
itemsToProcess.push(mapData);
if (!isFirstExecution)
itemsForAfterAddCallbacks[i] = mapData;
}
break;
}
}


callCallback(options['beforeMove'], itemsForMoveCallbacks);


ko.utils.arrayForEach(nodesToDelete, options['beforeRemove'] ? ko.cleanNode : ko.removeNode);


for (var i = 0, nextNode = ko.virtualElements.firstChild(domNode), lastNode, node; mapData = itemsToProcess[i]; i++) {

if (!mapData.mappedNodes)
ko.utils.extend(mapData, mapNodeAndRefreshWhenChanged(domNode, mapping, mapData.arrayEntry, callbackAfterAddingNodes, mapData.indexObservable));


for (var j = 0; node = mapData.mappedNodes[j]; nextNode = node.nextSibling, lastNode = node, j++) {
if (node !== nextNode)
ko.virtualElements.insertAfter(domNode, node, lastNode);
}


if (!mapData.initialized && callbackAfterAddingNodes) {
callbackAfterAddingNodes(mapData.arrayEntry, mapData.mappedNodes, mapData.indexObservable);
mapData.initialized = true;
}
}






callCallback(options['beforeRemove'], itemsForBeforeRemoveCallbacks);


callCallback(options['afterMove'], itemsForMoveCallbacks);
callCallback(options['afterAdd'], itemsForAfterAddCallbacks);


ko.utils.domData.set(domNode, lastMappingResultDomDataKey, newMappingResult);
}
})();

ko.exportSymbol('utils.setDomNodeChildrenFromArrayMapping', ko.utils.setDomNodeChildrenFromArrayMapping);
ko.nativeTemplateEngine = function () {
this['allowTemplateRewriting'] = false;
}

ko.nativeTemplateEngine.prototype = new ko.templateEngine();
ko.nativeTemplateEngine.prototype.constructor = ko.nativeTemplateEngine;
ko.nativeTemplateEngine.prototype['renderTemplateSource'] = function (templateSource, bindingContext, options) {
var useNodesIfAvailable = !(ko.utils.ieVersion < 9),
templateNodesFunc = useNodesIfAvailable ? templateSource['nodes'] : null,
templateNodes = templateNodesFunc ? templateSource['nodes']() : null;

if (templateNodes) {
return ko.utils.makeArray(templateNodes.cloneNode(true).childNodes);
} else {
var templateText = templateSource['text']();
return ko.utils.parseHtmlFragment(templateText);
}
};

ko.nativeTemplateEngine.instance = new ko.nativeTemplateEngine();
ko.setTemplateEngine(ko.nativeTemplateEngine.instance);

ko.exportSymbol('nativeTemplateEngine', ko.nativeTemplateEngine);
(function() {
ko.jqueryTmplTemplateEngine = function () {




var jQueryTmplVersion = this.jQueryTmplVersion = (function() {
if ((typeof(jQuery) == "undefined") || !(jQuery['tmpl']))
return 0;

try {
if (jQuery['tmpl']['tag']['tmpl']['open'].toString().indexOf('__') >= 0) {

return 2;
}
} catch(ex) {   }

return 1;
})();

function ensureHasReferencedJQueryTemplates() {
if (jQueryTmplVersion < 2)
throw new Error("Your version of jQuery.tmpl is too old. Please upgrade to jQuery.tmpl 1.0.0pre or later.");
}

function executeTemplate(compiledTemplate, data, jQueryTemplateOptions) {
return jQuery['tmpl'](compiledTemplate, data, jQueryTemplateOptions);
}

this['renderTemplateSource'] = function(templateSource, bindingContext, options) {
options = options || {};
ensureHasReferencedJQueryTemplates();


var precompiled = templateSource['data']('precompiled');
if (!precompiled) {
var templateText = templateSource['text']() || "";

templateText = "{{ko_with $item.koBindingContext}}" + templateText + "{{/ko_with}}";

precompiled = jQuery['template'](null, templateText);
templateSource['data']('precompiled', precompiled);
}

var data = [bindingContext['$data']];
var jQueryTemplateOptions = jQuery['extend']({ 'koBindingContext': bindingContext }, options['templateOptions']);

var resultNodes = executeTemplate(precompiled, data, jQueryTemplateOptions);
resultNodes['appendTo'](document.createElement("div"));

jQuery['fragments'] = {};
return resultNodes;
};

this['createJavaScriptEvaluatorBlock'] = function(script) {
return "{{ko_code ((function() { return " + script + " })()) }}";
};

this['addTemplate'] = function(templateName, templateMarkup) {
document.write("<script type='text/html' id='" + templateName + "'>" + templateMarkup + "<" + "/script>");
};

if (jQueryTmplVersion > 0) {
jQuery['tmpl']['tag']['ko_code'] = {
open: "__.push($1 || '');"
};
jQuery['tmpl']['tag']['ko_with'] = {
open: "with($1) {",
close: "} "
};
}
};

ko.jqueryTmplTemplateEngine.prototype = new ko.templateEngine();
ko.jqueryTmplTemplateEngine.prototype.constructor = ko.jqueryTmplTemplateEngine;


var jqueryTmplTemplateEngineInstance = new ko.jqueryTmplTemplateEngine();
if (jqueryTmplTemplateEngineInstance.jQueryTmplVersion > 0)
ko.setTemplateEngine(jqueryTmplTemplateEngineInstance);

ko.exportSymbol('jqueryTmplTemplateEngine', ko.jqueryTmplTemplateEngine);
})();
}));
}());
})();
