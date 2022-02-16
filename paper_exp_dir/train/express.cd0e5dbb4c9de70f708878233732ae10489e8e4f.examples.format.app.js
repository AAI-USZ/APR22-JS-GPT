


var express = require('../../');

var app = module.exports = express();



var items = [
{ name: 'foo' }
, { name: 'bar' }
, { name: 'baz' }
];



app.get('/', function(req, res, next){
res.statusCode = 200;
res.setHeader('Content-Type', 'text/html');
res.write('<p>Visit /item/2</p>');
res.write('<p>Visit /item/2.json</p>');
res.write('<p>Visit /item/2.xml</p>');
res.end();
});

app.get('/item/:id.:format?', function(req, res, next){
var id = req.params.id
, format = req.params.format
, item = items[id];

if (item) {

switch (format) {
case 'json':

res.send(item);
break;
case 'xml':


var xml = ''
+ '<items>'
+ '<item>' + item.name + '</item>'
+ '</items>';
res.type('xml').send(xml);
break;
case 'html':
default:

res.send('<h1>' + item.name + '</h1>');
}
} else {
