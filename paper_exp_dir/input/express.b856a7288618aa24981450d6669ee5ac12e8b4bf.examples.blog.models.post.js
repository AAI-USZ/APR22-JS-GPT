


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
if (undefined != data[key]) {
this[key] = data[key];
}
}
this.save(fn);
};

Post.prototype.destroy = function(fn){
exports.destroy(this.id, fn);
};

exports.count = function(fn){
fn(null, Object.keys(db).length);

