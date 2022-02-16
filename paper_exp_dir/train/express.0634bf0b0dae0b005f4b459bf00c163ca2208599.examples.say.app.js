


var express = require('../../')
, path = require('path')
, exec = require('child_process').exec
, fs = require('fs');



function errorHandler(voice) {
return function(err, req, res, next) {
