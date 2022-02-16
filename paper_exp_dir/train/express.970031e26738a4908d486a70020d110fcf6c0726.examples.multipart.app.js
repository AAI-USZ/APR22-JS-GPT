


var express = require('../../')
, format = require('util').format;

var app = module.exports = express()



app.use(express.bodyParser())

app.get('/', function(req, res){
res.send('<form method="post" enctype="multipart/form-data">'
+ '<p>Title: <input type="text" name="title" /></p>'
+ '<p>Image: <input type="file" name="image" /></p>'
+ '<p><input type="submit" value="Upload" /></p>'
+ '</form>');
});

app.post('/', function(req, res, next){




res.send(format('\nuploaded %s (%d Kb) to %s as %s'
, req.files.image.name
