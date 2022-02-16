var sys = require('sys'),
inspect = function(item){ sys.puts(sys.inspect(item)); },
Mongoose = require('../../mongoose/').Mongoose, db, Simple;

db = Mongoose.connect('mongodb://localhost/test');

Simple = Mongoose.noSchema('simple',db);

var s1 = new Simple({x : 2, y : 3}).save();

Simple.find().each(function(doc){
inspect(doc);
}).then(function(){
Simple.drop(function(){
Simple.close();
});
});

