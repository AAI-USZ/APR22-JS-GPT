
var express = require('../../lib/express')
, verbose = process.env.NODE_ENV != 'test'
, app = module.exports = express();

app.map = function(a, route){
route = route || '';
for (var key in a) {
switch (typeof a[key]) {

case 'object':
app.map(a[key], route + key);
