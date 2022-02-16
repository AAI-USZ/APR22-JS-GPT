
"use strict";

const xmlEscape = require("../xml-escape");






function getMessageType(message) {
if (message.fatal || message.severity === 2) {
return "error";
}
return "warning";

}





module.exports = function(results) {

let output = "";

output += "<?xml version=\"1.0\" encoding=\"utf-8\"?>";
output += "<checkstyle version=\"4.3\">";

results.forEach(result => {
const messages = result.messages;

output += `<file name="${xmlEscape(result.filePath)}">`;

messages.forEach(message => {
output += [
`<error line="${xmlEscape(message.line)}"`,
`column="${xmlEscape(message.column)}"`,
`severity="${xmlEscape(getMessageType(message))}"`,
`message="${xmlEscape(message.message)}${message.ruleId ? ` (${message.ruleId})` : ""}"`,
`source="${message.ruleId ? xmlEscape(`eslint.rules.${message.ruleId}`) : ""}" />`
].join(" ");
});

output += "</file>";

});

output += "</checkstyle>";

return output;
};
