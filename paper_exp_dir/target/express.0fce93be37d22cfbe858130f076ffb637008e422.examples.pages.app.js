var err = new Error('cannot find that');
app.error(function(err, req, res){
require('sys').puts(require('sys').inspect(err));
