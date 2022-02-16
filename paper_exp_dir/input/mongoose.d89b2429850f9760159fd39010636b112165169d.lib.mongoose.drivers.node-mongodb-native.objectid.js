


var ObjectId = require('mongodb').BSONPure.ObjectID;



var ObjectIdToString = ObjectId.toString.bind(ObjectId);

module.exports = exports = ObjectId;


exports.fromString = function(str){

if (!('string' === typeof str && 24 === str.length)) {
throw new Error("Invalid ObjectId");
}

return ObjectId.createFromHexString(str);
};



exports.toString = function(oid){
if (!arguments.length) return ObjectIdToString();
return oid.toHexString();
};
