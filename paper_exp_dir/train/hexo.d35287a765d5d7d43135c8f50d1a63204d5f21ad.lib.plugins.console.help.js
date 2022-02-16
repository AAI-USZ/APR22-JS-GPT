var commandList = function(title, list){
if (!list.length) return [];

var result = [title],
length = 0;

list = list.sort(function(a, b){
var nameA = a.name,
nameB = b.name;

if (nameA.length >= nameB.length && length < nameA.length){
length = nameA.length;
} else if (length < nameB.length){
length = nameB.length;
}

if (nameA < nameB) return -1;
else if (nameA > nameB) return 1;
else return 0;
});

list.forEach(function(item){
var str = '  ' + item.name.bold;

for (var i = 0; i < length - item.name.length; i++){
str += ' ';
}

str += '   ' + item.desc;

result.push(str);
});

return result;
};

module.exports = function(args, callback){
var command = args._.shift(),
list = hexo.extend.console.list(),
result = [],
item,
options;

if (list.hasOwnProperty(command) && command !== 'help'){
item = list[command];
options = item.options;

result.push(
'Usage: hexo ' + command + ' ' + (options.usage ? options.usage : ''),
