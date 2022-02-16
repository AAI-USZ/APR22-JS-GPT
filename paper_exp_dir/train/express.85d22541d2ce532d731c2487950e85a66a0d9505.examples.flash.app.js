

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');



var app = express.createServer(
express.cookieParser()
, express.session({ secret: 'keyboard cat' })
);



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.dynamicHelpers({



messages: require('express-messages')
});

app.dynamicHelpers({




page: function(req, res){
return req.url;
}
});

app.get('/', function(req, res){

req.flash('info', 'email queued');
req.flash('info', 'email sent');
