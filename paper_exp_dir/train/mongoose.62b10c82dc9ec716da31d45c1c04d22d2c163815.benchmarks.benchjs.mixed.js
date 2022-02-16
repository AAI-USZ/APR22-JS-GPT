
var mongoose = require('../../lib');
var Benchmark = require('benchmark');

var suite = new Benchmark.Suite();

var Schema = mongoose.Schema;
var ObjectId = Schema.Types.ObjectId;
var mongo = require('mongodb');
var utils = require('../../lib/utils.js');







mongoose.connect('mongodb://localhost/mongoose-bench', function (err) {
if (err) throw err;
mongo.connect('mongodb://localhost/mongoose-bench', function (err, db) {
if (err) throw err;

var Comments = new Schema;
Comments.add({
title     : String
, date      : Date
, body      : String
, comments  : [Comments]
});

var BlogPost = new Schema({
title     : String
, author    : String
, slug      : String
, date      : Date
, meta      : {
date      : Date
, visitors  : Number
}
, published : Boolean
, mixed     : {}
, numbers   : [Number]
, tags      : [String]
, owners    : [ObjectId]
, comments  : [Comments]
, def       : { type: String, default: 'kandinsky' }
});

var blogData = {
title : 'dummy post',
author : 'somebody',
slug : 'test.post',
date : new Date(),
meta : { date : new Date(), visitors: 9001},
published : true,
mixed : { thisIsRandom : true },
numbers : [1,2,7,10,23432],
tags : ['test', 'BENCH', 'things', 'more things'],
def : 'THANGS!!!',
comments : []
};
var commentData = {
title : 'test comment',
date : new Date(),
body : 'this be some crazzzyyyyy text that would go in a comment',
comments : [{ title : 'second level', date : new Date(), body : 'texttt'}]
};
for (var i=0; i < 5; i++) {
blogData.comments.push(commentData);
}
var UserSchema = new Schema({
name : String,
age: Number,
likes: [String],
address: String
});

var User = mongoose.model('User', UserSchema);
var BlogPost = mongoose.model('BlogPost', BlogPost);
var user = db.collection('user');
var blogpost = db.collection('blogpost');

var mIds = [];
var dIds = [];

var bmIds = [];
var bdIds = [];

var data = {
name : "name",
age : 0,
likes : ["dogs", "cats", "pizza"],
address : " Nowhere-ville USA"
};


var count = 4000;
for (var i=0; i < 1000; i++) {
data.age = Math.floor(Math.random() * 50);
User.create(data, function (err, u) {
if (err) throw err;
mIds.push(u.id);
--count || next();
});
var nData = utils.clone(data);
user.insert(nData, function (err, res) {
if (err) throw err;
dIds.push(res[0]._id);
--count || next();
});
BlogPost.create(blogData, function (err, bp) {
if (err) throw err;
bmIds.push(bp.id);
--count || next();
});

var bpData = utils.clone(blogData);
blogpost.insert(bpData, function (err, res) {
if (err) throw err;
bdIds.push(res[0]._id);
--count || next();
});
}

var mi = 0,
di = 0,
bmi = 0,
bdi = 0;

function getNextmId() {
mi = ++mi % mIds.length;
return mIds[mi];
}

function getNextdId() {
di = ++di % dIds.length;
return dIds[di];
}

function getNextbmId() {
bmi = ++bmi % bmIds.length;
return bmIds[bmi];
}

function getNextbdId() {
bdi = ++bdi % bdIds.length;
return bdIds[bdi];
}

function closeDB() {
var dm = false;
var dd = false;
User.remove(function () {
dm && mongoose.disconnect();
dm = true;
});
user.remove({}, function (err) {
if (err) throw err;
dd && db.close();
dd = true;
});
BlogPost.remove(function () {
dm && mongoose.disconnect();
dm = true;
});
blogpost.remove({}, function (err) {
if (err) throw err;
dd && db.close();
dd = true;
});
}

suite.add('Multi-Op - Mongoose - Heavy Read, low write', {
defer : true,
fn : function (deferred) {
var count = 150;
for (var i=0; i < 150; i++) {
User.findOne({ _id : getNextmId() }, function (err, res) {
if (err) throw err;
--count || deferred.resolve();
});
if (i%15 == 0) {
var nData = utils.clone(data);
User.create(nData, function (err, res) {
if (err) throw err;
--count || deferred.resolve();
});
}
}

