/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var extend  = require(__dirname + '/extend.js');

exports.create  = function(size) {

  var _size = parseInt(size, 10);
  var _ceil = Math.ceil(_size * 1.4);
  var _floo = Math.floor(_size * 0.8);

  var _list = [];

  var _stat = {
    'q' : 0,        /**<    查询次数(query)     */
    's' : 0,        /**<    查询步长(steps)     */
    'm' : 0,        /**<    未命中次数(miss)    */
  };

  var _self = {};

  /* {{{ private function _search() */
  function _search(key) {
    var _is = false;
    _stat.q++;
    for (var i = 0, m = _list.length; i < m; i++) {
      if (_list[i].k === key) {
        _is = true;
        break;
      }
    }
    _stat.s += i;
    _stat.m ++;

    return _is ? i : -1;
  }
  /* }}} */

  /* {{{ public function set() */
  _self.set = function(key, value) {
    var key = key.trim();
    var pos = _search(key);
    var itm = {'i':0,'k':key,'v':value};

    if (pos >= 0) {
      _list[pos] = itm;
    } else {
      if (_list.length >= _ceil) {
        _list = _list.slice(0, _floo);
      }
      _list.push(itm);
    }

    return _self;
  };
  /* }}} */

  /* {{{ public function get() */
  _self.get = function(key) {
    var pos = _search(key.trim());
    if (pos < 0) {
      return null;
    }
    var itm = _list[pos];
    itm.i++;
    if (pos > 0) {
      var i = Math.min(pos, itm.i * itm.i);
      var t = _list[pos -i];
      _list[pos - i] = itm;
      _list[pos] = {
        'i' : 0,
        'k' : t.k,
        'v' : t.v,
      };
    }

    return extend.clone(itm.v);
  };
  /* }}} */

  /* {{{ public function clean() */
  _self.clean   = function() {
    _list   = [];
    return _self;
  };
  /* }}} */

  /* {{{ public function status() */
  _self.status  = function() {
    return _stat;
  };
  /* }}} */

  return _self;
}

