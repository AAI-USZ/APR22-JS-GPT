

module.exports = function(args, content){
var id = args[0];

return '<div class="video-container"><iframe src="http://www.youtube.com/embed/' + id + '" frameborder="0" allowfullscreen></iframe></div>';
};
