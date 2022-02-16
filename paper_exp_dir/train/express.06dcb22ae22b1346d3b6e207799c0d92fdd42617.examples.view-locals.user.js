module.exports = User;



function User(name, age, species) {
this.name = name;
this.age = age;
this.species = species;
}

User.all = function(fn){
process.nextTick(function(){
