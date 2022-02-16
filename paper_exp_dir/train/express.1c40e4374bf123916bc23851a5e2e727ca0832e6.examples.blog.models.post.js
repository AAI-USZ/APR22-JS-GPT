


var ids = 0
, db = {};

var Post = exports = module.exports = function Post(title, body) {
this.id = ++ids;
this.title = title;
this.body = body;
this.createdAt = new Date;
};

Post.prototype.save = function(fn){
db[this.id] = this;
fn();
};

Post.prototype.update = function(data, fn){
this.updatedAt = new Date;
for (var key in data) {
