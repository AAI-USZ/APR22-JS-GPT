

"use strict";


function unIndent(strings, ...values) {
const text = strings
.map((s, i) => (i === 0 ? s : values[i - 1] + s))
.join("");
const lines = text.replace(/^\n/u, "").replace(/\n\s*$/u, "").split("\n");
const lineIndents = lines.filter(line => line.trim()).map(line => line.match(/ */u)[0].length);
const minLineIndent = Math.min(...lineIndents);

return lines.map(line => line.slice(minLineIndent)).join("\n");
}
