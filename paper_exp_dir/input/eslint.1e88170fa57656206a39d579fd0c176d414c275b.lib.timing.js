

"use strict";







function alignLeft(str, len, ch) {
return str + new Array(len - str.length + 1).join(ch || " ");
}



function alignRight(str, len, ch) {
return new Array(len - str.length + 1).join(ch || " ") + str;
}





const enabled = !!process.env.TIMING;

const HEADERS = ["Rule", "Time (ms)", "Relative"];
const ALIGN = [alignLeft, alignRight, alignRight];



function display(data) {
let total = 0;
const rows = Object.keys(data)
.map(key => {
const time = data[key];

total += time;
return [key, time];
})
.sort((a, b) => b[1] - a[1])
.slice(0, 10);

rows.forEach(row => {
row.push(`${(row[1] * 100 / total).toFixed(1)}%`);
row[1] = row[1].toFixed(3);
});

rows.unshift(HEADERS);

const widths = [];

rows.forEach(row => {
const len = row.length;

for (let i = 0; i < len; i++) {
const n = row[i].length;

if (!widths[i] || n > widths[i]) {
widths[i] = n;
}
}
});

const table = rows.map(row => (
row
.map((cell, index) => ALIGN[index](cell, widths[index]))
.join(" | ")
));

table.splice(1, 0, widths.map((width, index) => {
const extraAlignment = index !== 0 && index !== widths.length - 1 ? 2 : 1;

return ALIGN[index](":", width + extraAlignment, "-");
}).join("|"));

console.log(table.join("\n"));
}


module.exports = (function() {

const data = Object.create(null);


function time(key, fn) {
if (typeof data[key] === "undefined") {
data[key] = 0;
}

return function(...args) {
let t = process.hrtime();

fn(...args);
t = process.hrtime(t);
data[key] += t[0] * 1e3 + t[1] / 1e6;
};
}

if (enabled) {
process.on("exit", () => {
display(data);
});
}

return {
time,
enabled
};

}());
