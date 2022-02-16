var commandList = function(title, list){

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
