/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

exports.create  = function(options) {

  /**
   * @队列对象
   */
  var __slots   = {};

  /**
   * @访问顺序
   */
  var __orders  = [];

  /**
   * @队列属性
   */
  var __options = {};
  for (var i in options) {
    __options[i] = options[i];
  }

  var _queque   = {};

  /* {{{ public function push() */
  _queque.push  = function(anything, priority) {
    priority = priority && + priority | 0 || 0;
    if (priority < 0) {
      priority = 0;
    }
    if (!__slots[priority]) {
      __slots[priority] = [];
      __orders = null;
    }

    __slots[priority].push(anything);

    return _queque;
  };
  /* }}} */

  /* {{{ public function size() */
  _queque.size  = function(idx) {
    if (undefined != idx) {
      return __slots[idx] ? __slots[idx].length : 0;
    }

    var size  = 0;
    for (var idx in __slots) {
      size += __slots[idx].length;
    }

    return size;
  };
  /* }}} */

  /* {{{ public function fetch() */
  _queque.fetch = function() {
    if (null === __orders) {
      var tmp = [];
      for (var idx in __slots) {
        tmp.push(idx);
      }
      __orders = tmp.sort(function(a, b) {
        return a - b;
      });
    }

    for (var i = 0; i < __orders.length; i++) {
      var idx = __orders[i];
      if (__slots[idx] && __slots[idx].length) {
        return __slots[idx].shift();
      }
    }
    __orders = null;

    return null;
  };
  /* }}} */

  return _queque;

}
/* }}} */

