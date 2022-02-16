
function DAO(dbName){
this.dbName  = typeof dbName  !== 'undefined' ? dbName : pb.config.db.name;
}


DAO.PROJECT_ALL = {};


DAO.prototype.loadById = function(id, objectType, collection){
collection  = typeof collection  !== 'undefined' ? collection : object_type;
return query(collection, {_id: ObjectId(id), object_type: objectType});
};


DAO.prototype.query = function(entityType, where, select, orderby, limit, offset){

if (typeof entityType === 'undefined') {
throw Error('An entity type must be specified!');
}


where  = where  ? where  : {};
select = select ? select : {};
offset = offset ? offset : 0;

var cursor = pb.dbm[this.dbName].collection(entityType)
.find(where, select)
.skip(offset);

if (typeof orderBy !== 'undefined') {
cursor.sort(orderBy);
}

if (typeof limit !== 'undefined') {
cursor.limit(limit);
}

var promise = new Promise();
cursor.toArray(function(err, docs)
{
promise.resolve(err ? err : docs);
});


cursor.close(function(err){
if (err) {
pb.log.error("DAO::Query: An error occurred while attempting to close the cursor. "+err);
}
});
return promise;
};


DAO.prototype.insert = function(dbObject) {
var promise = new Promise();

DAO.updateChangeHistory(dbObject);
pb.dbm[this.dbName].collection(dbObject.object_type).insert(dbObject, function(err, doc){
promise.resolve(err ? err : doc[0]);
});
return promise;
};


DAO.prototype.update = function(dbObj) {

var promise = new Promise();

DAO.updateChangeHistory(dbObj);
pb.dbm[this.dbName].collection(dbObj.object_type).save(dbObj, function(err, doc){
promise.resolve(err ? err : doc);
});
return promise;
};


DAO.prototype.deleteById = function(oid, collection){
if (typeof oid === 'undefined') {
throw new Error('An id must be specified in order to delete');
}

var where   = DAO.getIDWhere(oid);
return this.deleteMatching(where, collection);
};


DAO.prototype.deleteMatching = function(where, collection){
if (typeof where === 'undefined') {
throw new Error('A where object must be specified in order to delete');
}

var promise = new Promise();
pb.dbm[this.dbName].collection(collection).remove(where, function(err, recordsDeleted) {

promise.resolve(err ? err : recordsDeleted);
if(err){
throw err;
}
});
return promise;
};


DAO.getIDWhere = function(oid){
return {
_id: ObjectID(oid.toString())
};
};


DAO.updateChangeHistory = function(dbObject){
if (typeof dbObject === 'undefined' || dbObject == null) {
throw new Error("The dbObject parameter is required");
}

var now = new Date();
if (typeof dbObject._id === 'undefined') {
dbObject.created = now;
}


dbObject.last_modified = now;
};

module.exports = DAO;
