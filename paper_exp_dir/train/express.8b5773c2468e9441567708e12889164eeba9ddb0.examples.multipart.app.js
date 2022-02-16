


var express = require('./../../lib/express'),
form = require('./../../support/connect-form'),
sys = require('sys');

var app = express.createServer(



form({ keepExtensions: true })
);

app.get('/', function(req, res){
res.send('<form method="post" enctype="multipart/form-data">'
+ '<p>Image: <input type="file" name="image" /></p>'
+ '<p><input type="submit" value="Upload" /></p>'
+ '</form>');
});

app.post('/', function(req, res, next){




req.form.complete(function(err, fields, files){
if (err) {
next(err);
} else {
console.log('\nuploaded %s to %s',
files.image.filename,
files.image.path);
res.redirect('back');
}
});



req.form.addListener('progress', function(bytesReceived, bytesExpected){
var percent = (bytesReceived / bytesExpected * 100) | 0;
sys.print('Uploading: %' + percent + '\r');
});
});

app.listen(3000);
