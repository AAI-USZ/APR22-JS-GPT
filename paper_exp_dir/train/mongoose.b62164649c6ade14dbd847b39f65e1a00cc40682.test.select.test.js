


var start = require('./common')
, assert = require('assert')
, mongoose = start.mongoose
, random = require('../lib/utils').random
, Query = require('../lib/query')
, Schema = mongoose.Schema
, SchemaType = mongoose.SchemaType
, CastError = SchemaType.CastError
, ObjectId = Schema.ObjectId
, MongooseBuffer = mongoose.Types.Buffer
, DocumentObjectId = mongoose.Types.ObjectId;
