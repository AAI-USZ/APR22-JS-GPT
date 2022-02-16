

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express')
, form = require('connect-form');

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
console.log('\nuploaded %s to %s'
,  files.image.filename
, files.image.path);
res.redirect('back');
}
});



req.form.on('progress', function(bytesReceived, bytesExpected){
var percent = (bytesReceived / bytesExpected * 100) | 0;
process.stdout.write('Uploading: %' + percent + '\r');
});
});

app.listen(3000);
console.log('Express app started on port 3000');
