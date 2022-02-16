

require.paths.unshift(__dirname + '/../../support');



var express = require('../../lib/express');



var app = express.createServer(
express.cookieDecoder()
, express.session({ secret: 'keyboard cat' })
);



app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');








app.dynamicHelpers({
messages: function(req, res){





return function(){

var messages = req.flash();

return res.partial('messages', {

object: messages,



as: 'types',


locals: { hasMessages: Object.keys(messages).length },


dynamicHelpers: false
});
}
}
});

app.dynamicHelpers({




page: function(req, res){
return req.url;
}
});

app.get('/', function(req, res){

req.flash('info', 'email queued');
req.flash('info', 'email sent');
req.flash('error', 'delivery failed');
res.render('index');
});

app.listen(3000);
console.log('Express app started on port 3000');
