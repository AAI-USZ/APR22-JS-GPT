var express = require('../..');

var app = module.exports = express();




app.engine('html', require('ejs').renderFile);


app.set('view engine', 'html');


app.set('views', __dirname + '/views');



app.response.message = function(msg){

var sess = this.req.session;

sess.messages = sess.messages || [];
sess.messages.push(msg);
return this;
};


if (!module.parent) app.use(express.logger('dev'));


app.use(express.static(__dirname + '/public'));


app.use(express.cookieParser('some secret here'));
app.use(express.session());


app.use(express.urlencoded({ extended: true }));


app.use(express.methodOverride());


app.use(function(req, res, next){
var msgs = req.session.messages || [];


res.locals.messages = msgs;


res.locals.hasMessages = !! msgs.length;



next();


req.session.messages = [];
});


require('./lib/boot')(app, { verbose: !module.parent });





app.use(function(err, req, res, next){

if (~err.message.indexOf('not found')) return next();


console.error(err.stack);


res.status(500).render('5xx');
});


app.use(function(req, res, next){
res.status(404).render('404', { url: req.originalUrl });
});


if (!module.parent) {
app.listen(3000);
console.log('Express started on port 3000');
}
