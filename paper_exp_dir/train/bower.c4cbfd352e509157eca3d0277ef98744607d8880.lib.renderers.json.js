function uncolor(str) {
return str.replace(/\x1B\[\d+m/g, '');
}

function stringify(data) {
return uncolor(JSON.stringify(data, null, '  '));
}



var nrData = 0;
