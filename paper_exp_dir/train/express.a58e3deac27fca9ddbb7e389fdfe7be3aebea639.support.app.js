


var express = require('../');

var app = express()
, blog = express()
, admin = express();

<<<<<<< HEAD
blog.use('/admin', admin);
=======

>>>>>>> feature/send-etag
app.use('/blog', blog);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.locals.self = true;

var repo = require('../package.json');
