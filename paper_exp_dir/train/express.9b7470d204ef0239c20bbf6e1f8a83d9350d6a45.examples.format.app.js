


var express = require('../../lib/express');

var app = express.createServer();



var items = [
{ name: 'foo' },
{ name: 'bar' },
{ name: 'baz' }
];



app.get('/', function(req, res, next){
res.send('Visit /item/2');
});

app.get('/item/:id.:format?', function(req, res, next){
var id = req.params.id,
format = req.params.format,
item = items[id];

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
res.contentType('.xml');
res.send(xml);
break;
case 'html':
default:

res.send('<h1>' + item.name + '</h1>');
}
} else {


next(new Error('Item ' + id + ' does not exist'));
}
});



app.use(express.errorHandler({ showStack: true }));

app.listen(3000);
