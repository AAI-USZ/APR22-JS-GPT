


var express = require('../../');

var app = module.exports = express();









app.engine('.html', require('ejs').__express);



app.set('views', __dirname + '/views');




app.set('view engine', 'html');


var users = [
{ name: 'tobi', email: 'tobi@learnboost.com' }
, { name: 'loki', email: 'loki@learnboost.com' }
, { name: 'jane', email: 'jane@learnboost.com' }
];

app.get('/', function(req, res){
res.render('users', { users: users });
});

if (!module.parent) {
app.listen(3000);
console.log('Express app started on port 3000');
}
