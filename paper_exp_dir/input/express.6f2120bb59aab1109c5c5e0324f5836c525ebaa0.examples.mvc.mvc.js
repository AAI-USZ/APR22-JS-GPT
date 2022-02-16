



exports.boot = function(app){
bootApplication(app);
bootControllers(app);
};



function bootApplication(app) {
app.use(express.logger({ format: ':method :url :status' }));
app.use(express.bodyDecoder());
app.use(express.methodOverride());
app.use(express.cookieDecoder());
app.use(express.session());
app.use(app.router);
app.use(express.staticProvider(__dirname + '/public'));


app.error(function(err, req, res){
console.dir(err)
res.render('500');
});


app.use(function(req, res){
res.render('404');
});


app.set('views', __dirname + '/views');
app.register('.html', require('ejs'));
app.set('view engine', 'html');


app.dynamicHelpers({
request: function(req){
return req;
},

hasMessages: function(req){
return Object.keys(req.session.flash || {}).length;
},

messages: function(req){
return function(){
var msgs = req.flash();
return Object.keys(msgs).reduce(function(arr, type){
return arr.concat(msgs[type]);
}, []);
}
}
});
}



function bootControllers(app) {
fs.readdir(__dirname + '/controllers', function(err, files){
if (err) throw err;
files.forEach(function(file){
bootController(app, file);
});
});
}



function bootController(app, file) {
