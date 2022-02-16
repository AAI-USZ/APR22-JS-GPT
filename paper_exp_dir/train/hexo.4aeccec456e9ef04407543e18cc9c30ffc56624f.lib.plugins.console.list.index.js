var store = {
page: require('./page'),
post: require('./post'),
route: require('./route'),
tag: require('./tag')
};

function listConsole(args){
var type = args._.shift();
var self = this;


if (!type || !store.hasOwnProperty(type)){
return this.call('help', {_: ['list']});
