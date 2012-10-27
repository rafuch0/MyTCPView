/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var Log     = require(__dirname + '/log.js');
var Extend  = require(__dirname + '/extend.js');
var Mysql   = require(__dirname + '/mysql.js');

/**
 * @存放对象的对象列表
 */
var __objects_list  = {};

/**
 * @key归一化
 */
function _idx_normalize(idx) {
  return idx.trim().toLowerCase();
}

/* {{{ public function cleanAll() */
/**
 * Remove objects from the factory
 */
function cleanAll(/*key*/) {
  switch (arguments.length) {
    case 0:
    __objects_list    = {};
    break;

    default:
    delete __objects_list[_idx_normalize(arguments[0])];
    break;
  }
}
exports.cleanAll    = cleanAll;
/* }}} */

/* {{{ public function setObject() */
/**
 * @param {String} key, indexName of the Object
 * @param {Object} obj
 * @return null
 */
function setObject(key, obj, _clone) {
  if (obj) {
    __objects_list[_idx_normalize(key)] = _clone ? Extend.clone(obj) : obj;
  }
}
exports.setObject   = setObject;
/* }}} */

/* {{{ public function getObject() */
/**
 * visit an object according by indexName (key)
 */
function getObject(key, _clone) {
  key = _idx_normalize(key);
  if (undefined === __objects_list[key]) {
    return null;
  }

  return _clone ? Extend.clone(__objects_list[key]) : __objects_list[key];
}
exports.getObject   = getObject;
/* }}} */

/* {{{ public function setMysql() */
function setMysql(key, obj) {
  if (!obj.query) {
    obj = Mysql.create(obj);
  }
  return setObject('#mysql/' + key, obj, false);
}
exports.setMysql    = setMysql;
/* }}} */

/* {{{ public function getMysql() */
function getMysql(key) {
  var mysql = getObject('#mysql/' + key, false);
  return mysql ? mysql : require(__dirname + '/mysql.js').blackhole();
}
exports.getMysql    = getMysql;
/* }}} */

/* {{{ public function setLog() */
function setLog(key, obj) {
  if (!obj.debug || 'function' != typeof(obj.debug)) {
    obj = Log.create(obj);
  }
  return setObject('#log/' + key, obj, false);
}
exports.setLog  = setLog;
/* }}} */

/* {{{ public function getLog() */
function getLog(key) {
  var _log = getObject('#log/' + key, false);
  return _log ? _log : require(__dirname + '/log.js').blackhole();
}
exports.getLog  = getLog;
/* }}} */

