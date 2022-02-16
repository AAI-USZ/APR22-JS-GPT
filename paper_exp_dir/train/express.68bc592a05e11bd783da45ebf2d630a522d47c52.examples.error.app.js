


var express = require('../../')
, app = express();

app.use(express.logger('dev'));
app.use(app.router);





app.use(error);

