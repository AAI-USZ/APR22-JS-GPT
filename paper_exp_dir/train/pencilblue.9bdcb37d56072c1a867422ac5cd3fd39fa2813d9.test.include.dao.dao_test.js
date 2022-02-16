


require('../../base_test');

process.on('uncaughtException', function(err) {
console.error(err.stack);
});

exports.testSimpleQuery = function(test){
loadConfiguration(function(){
dbm.getDB(MONGO_DATABASE).then(function(result){

(new pb.DAO()).query('setting').then(function(result){


dbm.shutdown();


test.done();
});
});
});
};

exports.testDeleteById = function(test){
var expectedId = '123456789012';
var collection = 'setting';
loadConfiguration(function(){
dbm.getDB(MONGO_DATABASE).then(function(result){

(new pb.DAO()).deleteById(expectedId, collection).then(function(result){


dbm.shutdown();

test.equals(0, result);
test.done();
});
});
});
};

exports.testInsert = function(test){
var expected = {
object_type: "setting",
key: "unit_test_insert",
value: "some value",
};
loadConfiguration(function(){
dbm.getDB(MONGO_DATABASE).then(function(result){
(new pb.DAO()).insert(expected).then(function(result){


dbm.shutdown();


test.notEqual(result._id, undefined);
test.notEqual(result._id, null);
test.equal(expected.object_type, result.object_type);
test.equal(expected.key, result.key);
test.equal(expected.value, result.value);
test.done();
});
});
});
};

exports.testUpdate = function(test){
var expected = {
object_type: "setting",
key: "unit_test_update",
value: "some value",
};
loadConfiguration(function(){
dbm.getDB(MONGO_DATABASE).then(function(result){
var dao = new pb.DAO();
dao.insert(expected).then(function(result){

result.value = "some value 2";
dao.update(result).then(function(uresult){


dbm.shutdown();


console.log("UPDATE: "+JSON.stringify(uresult));
test.equal(1, uresult);
test.done();
});
});
});
});
};
