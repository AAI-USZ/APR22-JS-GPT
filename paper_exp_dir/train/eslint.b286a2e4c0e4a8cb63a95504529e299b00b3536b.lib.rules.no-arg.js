







module.exports = function(context) {

return {

"MemberExpression": function(node) {
var objectName = node.object.name,
propertyName = node.property.name;

if (objectName === "arguments" && propertyName.match(/^calle[er]$/)) {
context.report(node, "Avoid arguments." + propertyName + ".");
}

}
};

};
