var Promise = require('bluebird');

var typeAlias = {
pre: 'before_post_render',
post: 'after_post_render'
};

function Filter(){
this.store = {};
}

