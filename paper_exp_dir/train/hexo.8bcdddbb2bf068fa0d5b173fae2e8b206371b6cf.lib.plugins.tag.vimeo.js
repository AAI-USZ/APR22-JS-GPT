

module.exports = function(args, content){
var id = args[0];

return '<div class="video-container"><iframe src="http://player.vimeo.com/video/' + id + '" width="560" height="315" frameborder="0" allowfullscreen></iframe></div>';
};
