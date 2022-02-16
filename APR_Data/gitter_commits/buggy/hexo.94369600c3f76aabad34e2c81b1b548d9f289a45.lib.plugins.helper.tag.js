var _ = require('lodash'),
  pathFn = require('path'),
  url = require('url'),
  qs = require('querystring'),
  util = require('../../util'),
  htmlTag = util.html_tag;

var mergeAttrs = function(options, attrs){
  if (options.class){
    var classes = options.class;

    if (Array.isArray(classes)){
      attrs.class = classes.join(' ');
    } else {
      attrs.class = classes;
    }
  }

  if (options.id) attrs.id = options.id;
};

exports.css = function(){
  var args = _.flatten(_.toArray(arguments)),
    config = this.config || hexo.config,
    root = config.root,
    out = [];

  args.forEach(function(path){
    if (pathFn.extname(path) !== '.css') path += '.css';

    var data = url.parse(path);
    if (!data.protocol && path.substring(0, 2) !== '//') path = root + path;

    out.push(htmlTag('link', {
      rel: 'stylesheet',
      href: path,
      type: 'text/css'
    }));
  });

  return out.join('\n');
};

exports.js = function(){
  var args = _.flatten(_.toArray(arguments)),
    config = this.config || hexo.config,
    root = config.root,
    out = [];

  args.forEach(function(path){
    if (pathFn.extname(path) !== '.js') path += '.js';

    var data = url.parse(path);
    if (!data.protocol && path.substring(0, 2) !== '//') path = root + path;

    out.push(htmlTag('script', {
      src: path,
      type: 'text/javascript'
    }, ''));
  });

  return out.join('\n');
};

exports.link_to = function(path, text, options){
  if (typeof options === 'boolean') options = {external: options};

  options = _.extend({
    external: false,
    class: '',
    id: ''
  }, options);

  if (!text) text = path.replace(/^https?:\/\//, '');

  var attrs = {
    href: path,
    title: text
  };

  mergeAttrs(options, attrs);

  if (options.external){
    attrs.target = '_blank';
    attrs.rel = 'external';
  }

  return htmlTag('a', attrs, text);
};

exports.mail_to = function(path, text, options){
  options = _.extend({
    class: '',
    id: '',
    subject: '',
    cc: '',
    bcc: '',
    body: ''
  }, options);

  if (Array.isArray(path)) path = path.join(',');
  if (!text) text = path;

  var attrs = {
    href: 'mailto:' + path,
    title: text
  };

  mergeAttrs(options, attrs);

  var data = {};

  ['subject', 'cc', 'bcc', 'body'].forEach(function(i){
    var item = options[i];

    if (options[i]){
      data[i] = Array.isArray(item) ? item.join(',') : item;
    }
  });

  var querystring = qs.stringify(data);
  if (querystring) attrs.href += '?' + querystring;

  return htmlTag('a', attrs, text);
};

exports.image_tag = function(path, options){
  options = _.extend({
    alt: '',
    class: '',
    id: '',
    width: 0,
    height: 0
  }, options);

  var attrs = {
    src: path
  };

  mergeAttrs(options, attrs);

  ['alt', 'width', 'height'].forEach(function(i){
    if (options[i]) attrs[i] = options[i];
  });

  return htmlTag('img', attrs);
};

exports.favicon_tag = function(path){
  return htmlTag('link', {
    rel: 'shortcut icon',
    href: path
  });
};

exports.feed_tag = function(path, options){
  var config = this.config || hexo.config;

  options = _.extend({
    title: config.title,
    type: 'atom'
  }, options);

  var attrs = {
    rel: 'alternative',
    href: path,
    title: options.title,
    type: 'application/' + options.type + '+xml'
  };

  return htmlTag('link', attrs);
};