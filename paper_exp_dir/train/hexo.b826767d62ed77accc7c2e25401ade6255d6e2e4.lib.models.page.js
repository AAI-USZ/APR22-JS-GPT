'use strict';

const { Schema } = require('warehouse');
const { join } = require('path');
const Moment = require('./types/moment');
const moment = require('moment');
const full_url_for = require('../plugins/helper/full_url_for');
const { prettyUrls } = require('hexo-util');

module.exports = ctx => {
const Page = new Schema({
title: {type: String, default: ''},
date: {
type: Moment,
default: moment,
language: ctx.config.languages,
timezone: ctx.config.timezone
