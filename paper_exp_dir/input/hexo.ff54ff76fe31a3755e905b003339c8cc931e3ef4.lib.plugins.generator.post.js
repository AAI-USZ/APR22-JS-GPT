var extend = require('../../extend'),
route = require('../../route');

extend.generator.register(function(locals, render, callback){
locals.posts.each(function(item){
