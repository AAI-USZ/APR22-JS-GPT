


var express = require('./../../lib/express'),
sys = require('sys');

var app = express.createServer();




app.use(express.bodyDecoder());




app.use(express.methodOverride());


app.use(express.cookieDecoder());



app.use(express.session());

app.get('/', function(req, res){

var name = req.param('name') || '';


var label = name ? 'Update' : 'Save';








var msgs = '<ul>',
flash = req.flash();
Object.keys(flash).forEach(function(type){
flash[type].forEach(function(msg){
msgs += '<li class="' + type + '">' + msg + '</li>';
});
});
msgs += '</ul>';



res.send(msgs
+ '<form method="post">'
+ (name ? '<input type="hidden" value="put" name="_method" />' : '')
+ 'Name: <input type="text" name="name" value="' + name + '" />'
+ '<input type="submit" value="' + label + '" />'
+ '</form>');
});

app.post('/', function(req, res){
if (req.body.name) {

req.flash('info', 'Saved ' + req.body.name);
res.redirect('/?name=' + req.body.name);
} else {
req.flash('error', 'Error: name required');
res.redirect('/');
}
});

app.put('/', function(req, res){

req.flash('info', 'Updated ' + req.body.name);
res.redirect('/?name=' + req.body.name);
});

app.listen(3000);
console.log('Express app started on port 3000');
