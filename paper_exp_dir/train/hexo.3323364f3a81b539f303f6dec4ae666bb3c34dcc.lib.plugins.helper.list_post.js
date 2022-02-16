var _ = require('lodash');

function findData(data, source){
if (!source.length) return true;

for (var i = 0, len = source.length; i < len; ++i){
if (data.indexOf(source[i]) != -1) return true;
}

return false;
}

function arrayCaseFind(data, value){
value = value.toUpperCase();

for (var i = 0,len = data.length; i < len; i++){
if (data[i].toUpperCase() === value) return true;
}

return false;
}

function makeWhereQuery(index){
return function(data){
return findData(data, index);
};
}

var getPosts = function(site, options){
options = _.extend({
count: 6,
orderby: 'date',
order: -1,
query: {
tags: '',
categories: '',
operator: ''
}
}, options);

var posts = site.posts;
var queryData = [];
var conditions = options.query;
var queryOperator = 'and';
