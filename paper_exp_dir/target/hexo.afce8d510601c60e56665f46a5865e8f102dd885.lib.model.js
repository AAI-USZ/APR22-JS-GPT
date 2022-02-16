posts: [Number]
return new Query(this.posts, null, dbPosts);
var dbPosts = exports.posts = db.collection('posts', schemaPosts),
