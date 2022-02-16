


var express = require('../../lib/express')
, app = express()
, db = { users: [] };

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.bodyParser());



require('./boot')(app, db);

app.listen(3000);
