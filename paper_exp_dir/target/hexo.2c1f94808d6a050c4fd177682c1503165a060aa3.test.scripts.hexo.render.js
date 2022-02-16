return hexo.render.render().then(function(){
assert.fail();
}).catch(function(err){
