this.find = function(query){
queryEngine.createCollection(this.toArray()).findAll(query);
};
