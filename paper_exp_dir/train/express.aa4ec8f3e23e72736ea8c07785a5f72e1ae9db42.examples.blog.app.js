


var express = require('../../')
, app = module.exports = express();



app.set('views', __dirname + '/views');
app.set('view engine', 'jade');



app.configure('development',function(){
app.use(express.logger('dev'));
})

app.configure(function(){
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('keyboard cat'));
app.use(express.session());
app.use(app.router);
app.use(express.static(__dirname + '/public'));
app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});



app.locals.use(function(req, res){


res.locals.error = req.session.error || '';
res.locals.message = req.session.message || '';

delete req.session.error;
delete req.session.message;
});



require('./routes/site')(app);
require('./routes/post')(app);

if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
}
