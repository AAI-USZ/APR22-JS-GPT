var store = {
  page: require('./page'),
  post: require('./post'),
  route: require('./route')
};

function listConsole(args){
  var type = args._.shift();
  var self = this;

  // Display help message if user didn't input any arguments
  if (!type || !store.hasOwnProperty(type)){
    return this.call('help', {_: ['list']});
  }

  return this.post.load().then(function(){
    return store[type].call(self, args);
  });
}

module.exports = listConsole;