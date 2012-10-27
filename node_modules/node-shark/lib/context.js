/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var extend  = require(__dirname + '/extend.js');

/**
 * @global object list
 */
var __content_list	= {};

exports.set	= function(id, name, value) {
  if (undefined === __content_list[id]) {
    __content_list[id] = {};
  }
  __content_list[id][name] = value;
}

exports.get	= function(id, name) {
  if (undefined === id || null === id) {
    return null;
  }

  if (undefined === __content_list[id]) {
    return null;
  }

  if (undefined === name || null === name) {
    return extend.clone(__content_list[id]);
  }

  if (undefined === __content_list[id][name]) {
    return null;
  }

  return extend.clone(__content_list[id][name]);
}

exports.clean	= function(id, name) {
  if (undefined === id) {
    __content_list  = {};
    return;
  }

  if (__content_list[id]) {
    if (!name) {
      delete __content_list[id];
    } else {
      delete __content_list[id][name];
    }
  }
}

exports.push = function(id, name, value) {
  if (undefined === __content_list[id]) {
    __content_list[id] = {};
  }

  if (undefined === __content_list[id][name]) {
    __content_list[id][name] = [];
  } else if (!Array.isArray(__content_list[id][name])) {
    __content_list[id][name] = [__content_list[id][name]];
  }
  __content_list[id][name].push(value);
}

