

module.exports = function(args, content){
var id = args.shift();
var file = args.length ? '?file=' + args[0] : '';

return '<script src="//gist.github.com/' + id + '.js' + file + '"></script>';
};
