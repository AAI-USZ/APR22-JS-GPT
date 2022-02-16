
var express = require('..');
var app = express();



var n = parseInt(process.env.MW || '1', 10);
console.log('  %s middleware', n);

while (n--) {
app.use(function(req, res, next){
next();
});
