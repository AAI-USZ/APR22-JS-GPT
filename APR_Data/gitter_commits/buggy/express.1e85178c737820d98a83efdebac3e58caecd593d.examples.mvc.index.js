
var express = require('../..');

var app = express();

// settings

// map .renderFile to ".html" files
app.engine('html', require('ejs').renderFile);

// make ".html" the default
app.set('view engine', 'html');

// define a custom res.message() method
// which stores messages in the session
app.response.message = function(msg){
  // reference `req.session` via the `this.req` reference
  var sess = this.req.session;
  // simply add the msg to an array for later
  sess.messages = sess.messages || [];
  sess.messages.push(msg);
  return this;
};

// expose the "messages" local variable when views are rendered
app.locals.use(function(req, res){
  var msgs = req.session.messages || [];

  // expose "messages" local variable
  res.locals.messages = msgs;

  // expose "hasMessages"
  res.locals.hasMessages = !! msgs.length;

  /*

  This is equivalent:

   res.locals({
     messages: msgs,
     hasMessages: !! msgs.length
   });

  */

  // empty or "flush" the messages so they
  // don't build up
  req.session.messages = [];
});

// serve static files
app.use(express.static(__dirname + '/public'));

// session support
app.use(express.cookieParser('some secret here'));
app.use(express.session());

// parse request bodies (req.body)
app.use(express.bodyParser());

// support _method (PUT in forms etc)
app.use(express.methodOverride());

// load controllers
require('./lib/boot')(app);

app.listen(3000);
console.log('\n  listening on port 3000\n');