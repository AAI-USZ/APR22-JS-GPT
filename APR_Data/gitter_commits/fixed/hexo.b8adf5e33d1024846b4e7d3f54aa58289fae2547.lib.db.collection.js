var EventEmitter = require('events').EventEmitter,
  util = require('util'),
  _ = require('underscore'),
  Query = require('./query'),
  single = require('./single');

function Collection(name, schema, parent, store){
  this.name = name;
  this.primary = store ? store._.primary : 1;
  this.schema = schema;
  this.store = store ? _.omit(store, '_') : {};
  this.index = [];

  this.__defineGetter__('parent', function(){
    return parent;
  });

  this.__defineSetter__('parent', function(obj){
    parent = obj;
  });

  this.__defineGetter__('length', function(){
    return this.toArray().length;
  });
};

module.exports = Collection;
util.inherits(Collection, EventEmitter);

Collection.prototype.first = function(obj){
  var id = this.index[0];
  if (typeof obj === 'undefined'){
    return this.get(id);
  } else {
    this.update(id, obj);
    return this;
  }
};

Collection.prototype.last = function(obj){
  var id = this.index[this.length - 1];
  if (typeof obj === 'undefined'){
    return this.get(id);
  } else {
    this.update(id, obj);
    return this;
  }
};

Collection.prototype.toArray = function(){
  var arr = [];

  this.each(function(item){
    arr.push(item);
  });

  return arr;
};

Collection.prototype.toJSON = function(){
  var obj = {};

  this.each(function(item, i){
    obj[i] = item;
  });

  return obj;
};

Collection.prototype.stringify = function(){
  return JSON.stringify(this.toJSON());
};

Collection.prototype.forEach = Collection.prototype.each = function(iterator){
  var index = this.index;
  for (var i=0, len=index.length; i<len; i++){
    var item = index[i];
    iterator(this.get(item), item);
  }
  return this;
};

Collection.prototype.insert = function(obj, callback){
  if (!_.isFunction(callback)) callback = function(){};

  if (_.isArray(obj)){
    var arr = [];
    for (var i=0, len=obj.length; i<len; i++){
      this.insert(obj[i], function(item){
        arr.push(item);
      });
    }
    callback.call(this, arr);
  } else {
    var id = this.primary++;
    this.store[id] = this.schema.save(obj);
    this.index.push(id);
    var item = this.get(id);
    this.emit('insert', item, id);
    callback.call(this, item);
  }

  return this;
};

Collection.prototype.update = function(id, obj){
  if (_.isObject(id)){
    for (var i in id){
      this.update(i, id[i]);
    }
  } else {
    var item = this.store[id];

    _.each(obj, function(val, i){
      if (item.hasOwnProperty(i) && _.isObject(val)){
        var target = item[i];

        if (_.isArray(target)){
          _.each(val, function(prop, j){
            switch (j){
              case '$push':
                if (_.isArray(prop)){
                  item[i] = target.concat(prop);
                } else {
                  item[i].push(prop);
                }
                break;

              case '$pull':
                if (!_.isArray(prop)) prop = [prop];
                item[i] = _.difference(target, prop);
                break;

              case '$shift':
                if (prop > 0){
                  for (var k=0; k<prop; k++){
                    item[i].shift();
                  }
                } else if (prop < 0){
                  for (var k=0; k<-prop; k++){
                    item[i].pop();
                  }
                }
                break;

              case '$pop':
                if (prop > 0){
                  for (var k=0; k<prop; k++){
                    item[i].pop();
                  }
                } else if (prop < 0){
                  for (var k=0; k<-prop; k++){
                    item[i].shift();
                  }
                }
                break;
            }
          });
        } else if (_.isNumber(target)){
          _.each(val, function(prop, j){
            switch (j){
              case '$inc':
                item[i] += prop;
                break;

              case '$dec':
                item[i] -= prop;
                break;
            }
          });
        } else {
          item[i] = val;
        }
      } else {
        item[i] = val;
      }
    });

    this.store[id] = this.schema.save(item);
    this.emit('update', this.get(id), id);
  }

  return this;
};

var defaults = {
  single: true,
  raw: false
};

Collection.prototype.get = function(id, options){
  var options = _.extend(defaults, options);

  if (_.isArray(id)){
    var arr = [];

    for (var i=0, len=id.length; i<len; i++){
      arr.push(this.get(id[i], options));
    }

    return arr;
  } else {
    var id = _.isNaN(+id) ? id : +id,
      index = this.index,
      pos = index.indexOf(id);

    if (pos === -1) return undefined;

    var obj = _.clone(this.store[id]);
    obj._id = id;
    if (options.single){
      return single(this.schema.restore(obj, this.parent), this);
    } else {
      if (options.raw){
        return obj;
      } else {
        return this.schema.restore(obj, this.parent);
      }
    }
  }
};

Collection.prototype.remove = function(id){
  if (_.isArray(id)){
    for (var i=0, len=id.length; i<len; i++){
      var item = id[i];
      delete this.store[item];
      this.emit('remove', item);
    }
    this.index = _.without(this.index, id);
  } else {
    delete this.store[id];
    this.index = _.without(this.index, id);
    this.emit('remove', id);
  }

  return this;
};

Collection.prototype.destroy = function(){
  delete this.parent.store[this.name];
};

Collection.prototype.find = function(queries){
  var arr = [];

  this.each(function(item, id){
    var match = true;

    for (var key in queries){
      var split = key.split('.'),
        cursor = item;

      for (var i=0, len=split.length; i<len; i++){
        cursor = cursor[split[i]];
      }

      var query = queries[key];

      if (_.isObject(query)){
        for (var i in query){
          var rule = query[i];

          switch (i){
            case '$lt':
              match = cursor < rule;
              break;

            case '$lte':
              match = cursor <= rule;
              break;

            case '$gt':
              match = cursor > rule;
              break;

            case '$gte':
              match = cursor >= rule;
              break;

            case '$size':
              match = cursor.length === rule;
              break;

            case '$in':
              if (!_.isArray(rule)) rule = [rule];
              match = rule.indexOf(cursor) !== -1;
              break;

            case '$nin':
              if (!_.isArray(rule)) rule = [rule];
              match = rule.indexOf(cursor) === -1;
              break;

            case '$exists':
              match = cursor != null && typeof cursor !== 'undefined';
              break;
          }

          if (!match) break;
        }
      } else if (_.isRegExp(query)){
        match = !!query.exec(cursor);
      } else {
        match = query === cursor;
      }

      if (!match) break;
    }

    if (match) arr.push(id);
  });

  return new Query(arr, null, this);
};

Collection.prototype.findOne = function(query){
  return this.find(query).first();
};

Collection.prototype.toQuery = function(){
  return new Query(this.index, null, this);
};

Collection.prototype.slice = function(start, end){
  return this.toQuery().slice(start, end);
};

Collection.prototype.skip = function(num){
  return this.toQuery().skip(num);
};

Collection.prototype.limit = function(num){
  return this.toQuery().limit(num);
};

Collection.prototype.reverse = function(){
  return this.toQuery().reverse();
};

Collection.prototype.random = Collection.prototype.shuffle = function(){
  return this.toQuery().random();
};

Collection.prototype.select = function(fields){
  return this.toQuery().select(fields);
};

Collection.prototype.sort = function(orderby, order){
  return this.toQuery().sort(orderby, order);
};