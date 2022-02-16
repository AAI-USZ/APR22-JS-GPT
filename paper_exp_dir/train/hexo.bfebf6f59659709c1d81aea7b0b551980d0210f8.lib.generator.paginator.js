var async = require('async'),
util = require('../util'),
file = util.file,
config = hexo.config;

function Paginator(base, posts, num, total){
this.per_page = config.per_page;
this.total = total;
this.current = num;
this.current_url = num === 1 ? base : base + config.pagination_dir + '/' + num + '/';
this.posts = posts.slice(config.per_page * (num - 1), config.per_page * num);

if (posts.year) this.year = posts.year;
if (posts.month) this.month = posts.month;
if (posts.category) this.category = posts.category;
if (posts.tag) this.tag = posts.tag;
if (posts.archive) this.archive = posts.archive;

if (num === 1){
this.prev = 0;
this.prev_link = '';
} else if (num === 2){
this.prev = 1;
this.prev_link = base;
} else {
this.prev = num - 1;
this.prev_link = base + config.pagination_dir + '/' + (num - 1);
}

if (num === total){
this.next = 0;
this.next_link = '';
} else {
this.next = num + 1;
this.next_link = base + config.pagination_dir + '/' + (num + 1);
}
};

module.exports = function(base, posts, layout, render, callback){
var publicDir = hexo.public_dir;

if (config.per_page && posts.length){
var total = Math.ceil(posts.length / config.per_page),
i = 1;

async.whilst(
function(){
return i <= total;
},
function(next){
var paginator = new Paginator(base, posts, i, total);

var result = render(layout, paginator);
if (!result) result = render('archive', paginator);
if (!result) result = render('index', paginator);

i++;
file.write(publicDir + paginator.current_url + 'index.html', result, next);
},
callback
);
} else {
var result = render(layout, {posts: posts});
if (!result) result = render('archive', {posts: posts});
if (!result) result = render('index', {posts: posts});

file.write(publicDir + base + 'index.html', result, callback);
}
};
