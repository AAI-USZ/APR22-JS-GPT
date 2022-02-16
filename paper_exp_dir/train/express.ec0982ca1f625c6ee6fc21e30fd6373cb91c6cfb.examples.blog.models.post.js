


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

Post.prototype.validate = function(fn){
if (!this.title) return fn(new Error('_title_ required'));
if (!this.body) return fn(new Error('_body_ required'));
if (this.body.length < 10) {
return fn(new Error(
'_body_ should be at least **10** characters long, was only _' + this.title.length + '_'));
}
fn();
};


Post.prototype.update = function(data, fn){
this.updatedAt = new Date;
