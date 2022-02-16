

var express = require('../..');
var multiparty = require('multiparty');
var format = require('util').format;

var app = module.exports = express();

app.get('/', function(req, res){
res.send('<form method="post" enctype="multipart/form-data">'
+ '<p>Title: <input type="text" name="title" /></p>'
+ '<p>Image: <input type="file" name="image" /></p>'
+ '<p><input type="submit" value="Upload" /></p>'
+ '</form>');
});

app.post('/', function(req, res, next){

var form = new multiparty.Form();
var image;
var title;

form.on('error', next);
form.on('close', function(){
res.send(format('\nuploaded %s (%d Kb) as %s'
, image.filename
, image.size / 1024 | 0
, title));
});


form.on('field', function(name, val){
if (name !== 'title') return;
title = val;
});


form.on('part', function(part){
if (!part.filename) return;
if (part.name !== 'image') return part.resume();
image = {};
image.filename = part.filename;
image.size = 0;
part.on('data', function(buf){
image.size += buf.length;
});
});



form.parse(req);
});


if (!module.parent) {
app.listen(4000);
console.log('Express started on port 4000');
}
