


var express = require('../../lib/express');



var app = express.createServer(
express.cookieDecoder(),
express.session()
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
