var rParam = /([:\*])([\w\?]*)?/g;
function Pattern(rule){
this.filter = regexFilter(rule);
