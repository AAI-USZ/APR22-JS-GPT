function uncolor(str) {
return str.replace(/\x1B\[\d+m/g, '');
}

function stringify(data) {
return uncolor(JSON.stringify(data, null, '  '));
}



var nrData = 0;



var json = {
begin: function () {
process.stderr.write('[');
},
end: function (data) {
process.stderr.write(']\n');

if (data) {
process.stdout.write(stringify(data) + '\n');
}
},
error: function (err) {
this.data(err);
},
data: function (data) {
if (nrData) {
process.stderr.write(', ');
}

process.stderr.write(stringify(data));
nrData++;
