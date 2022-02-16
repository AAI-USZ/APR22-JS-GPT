


var express = require('../../')
, app = express();









app.engine('.html', require('ejs').__express);



app.set('views', __dirname + '/views');


