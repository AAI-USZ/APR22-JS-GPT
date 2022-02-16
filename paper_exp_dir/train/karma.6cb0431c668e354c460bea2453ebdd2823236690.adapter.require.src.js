



var normalizePath = function(path) {
var normalized = [];
var parts = path.split('/');

for (var i = 0; i < parts.length; i++) {
if (parts[i] === '.') {
continue;
}

if (parts[i] === '..' && normalized.length && normalized[normalized.length - 1] !== '..') {
normalized.pop();
continue;
}

normalized.push(parts[i]);
}

return normalized.join('/');
};

var createPatchedLoad = function(files, originalLoadFn) {
return function (context, moduleName, url) {
url = normalizePath(url);

if (files.hasOwnProperty(url)) {
url = url + '?' + files[url];
} else {
console.error('There is no timestamp for ' + url + '!');
}

return originalLoadFn.call(this, context, moduleName, url);
};
};
