
"use strict";

const xmlEscape = require("../xml-escape");






function getMessageType(message) {
if (message.fatal || message.severity === 2) {
return "Error";
}
return "Warning";

}





module.exports = function(results) {

let output = "";

output += "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n";
output += "<testsuites>\n";

results.forEach(result => {

const messages = result.messages;

if (messages.length > 0) {
output += `<testsuite package="org.eslint" time="0" tests="${messages.length}" errors="${messages.length}" name="${result.filePath}">\n`;
messages.forEach(message => {
const type = message.fatal ? "error" : "failure";

output += `<testcase time="0" name="org.eslint.${message.ruleId || "unknown"}">`;
output += `<${type} message="${xmlEscape(message.message || "")}">`;
output += "<![CDATA[";
output += `line ${message.line || 0}, col `;
output += `${message.column || 0}, ${getMessageType(message)}`;
output += ` - ${xmlEscape(message.message || "")}`;
output += (message.ruleId ? ` (${message.ruleId})` : "");
output += "]]>";
output += `</${type}>`;
output += "</testcase>\n";
});
output += "</testsuite>\n";
} else {
output += `<testsuite package="org.eslint" time="0" tests="1" errors="0" name="${result.filePath}">\n`;
output += `<testcase time="0" name="${result.filePath}" />\n`;
output += "</testsuite>\n";
}

});

output += "</testsuites>\n";

return output;
};
