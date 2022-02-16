'use strict';

const { Schema } = require('warehouse');
const { join } = require('path');
const Moment = require('./types/moment');
const moment = require('moment');
const { encodeURL } = require('hexo-util');

module.exports = ctx => {
const Page = new Schema({
title: {type: String, default: ''},
date: {
type: Moment,
default: moment,
language: ctx.config.languages,
timezone: ctx.config.timezone
