
"use strict";






module.exports = function(s) {
return (`${s}`).replace(/[<>&"'\x00-\x1F\x7F\u0080-\uFFFF]/gu, c => { // eslint-disable-line no-control-regex
switch (c) {
case "<":
return "&lt;";
case ">":
return "&gt;";
case "&":
return "&amp;";
case "\"":
return "&quot;";
case "'":
return "&apos;";
default:
return `&#${c.charCodeAt(0)};`;
}
});
};
