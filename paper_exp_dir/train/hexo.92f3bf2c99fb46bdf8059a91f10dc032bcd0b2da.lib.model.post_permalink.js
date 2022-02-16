exports.id = function(post){
return post.id || post._id;
};

exports.title = function(post){
return post.slug;
};

exports.year = function(post){
return post.date.format('YYYY');
};

exports.month = function(post){
return post.date.format('MM');
};

exports.day = function(post){
return post.date.format('DD');
};

exports.i_month = function(post){
return post.date.format('M');
};

exports.i_day = function(post){
return post.date.format('D');
};

exports.category = function(post){
var categories = post.categories;

