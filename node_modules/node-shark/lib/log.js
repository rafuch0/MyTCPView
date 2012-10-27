/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var fs  = require('fs');

/**
 * @log level defination
 */
var DEBUG   = exports.DEBUG     = 0x01;
var NOTICE  = exports.NOTICE    = 0x02;
var WARN    = exports.WARN      = 0x04;
var ERROR   = exports.ERROR     = 0x08;
var ALL     = exports.ALL       = 0xff;

/* {{{ private function _flush_time() */
function _flush_time() {
  var __t = new Date();
  var now = [__t.getMonth() + 1, __t.getDate(), __t.getHours(), __t.getMinutes(), __t.getSeconds()];
  for (var i = 0; i < now.length; i++) {
    if (now[i] < 10) {
      now[i] = '0' + now[i];
    }
  }
  var ret     = [__t.getFullYear(), '-', now.shift(), '-', now.shift(), ' '];
  return ret.join('') + now.join(':');
}
var _timenow  = _flush_time();
var _interval = setInterval(function() {
  _timenow    = _flush_time();
}, 500);
/* }}} */

/* {{{ private function _build() */
function _build(info) {
  return JSON.stringify(info);
}
/* }}} */

/* {{{ private function _print() */
function _print(msg, color) {
  console.log(msg);
}
/* }}} */

exports.create  = function(options) {

  var _options  = {
    'file'  : '',
    'level' : ALL & ~DEBUG,
    'buffer': 16 * 1024,
  };

  for (var i in options) {
    _options[i] = options[i];
  }

  var _stream   = null;
  if (_options.file) {
    try {
      _stream   = fs.createWriteStream(_options.file, {
        'flags' : 'a+', 'encoding' : 'utf8', 'mode' : 0644,
      });
    } catch (e) {
    }
  }

  var _buffers  = [];
  var _bufsize  = 0;

  /* {{{ private function _write() */
  function _write(type, tag, info) {
    var msg = [type + ':', '[' + _timenow + ']', tag.trim().toUpperCase(), _build(info)];
    msg = msg.join("\t");

    if (!_stream) {
      _print(msg, type);
      return;
    }

    _buffers.push(msg);
    _bufsize += msg.length;
    if (_bufsize >= _options.buffer) {
      _flush_stream();
    }
  }
  /* }}} */

  /* {{{ private function _flush_stream() */
  function _flush_stream() {
    if (_buffers.length < 1) {
      return;
    }
    _stream.write(_buffers.join("\n") + "\n");
    _buffers  = [];
    _bufsize  = 0;
  }
  process.on('exit', _flush_stream);
  var _self = {};
  /* }}} */

  /* {{{ public function debug() */
  _self.debug   = function(tag, info) {
    if (DEBUG & _options.level) {
      _write('DEBUG', tag, info);
    }
  };
  /* }}} */

  /* {{{ public function notice() */
  _self.notice  = function(tag, info) {
    if (NOTICE & _options.level) {
      _write('NOTICE', tag, info);
    }
  };
  /* }}} */

  /* {{{ public function warn() */
  _self.warn    = function(tag, info) {
    if (WARN & _options.level) {
      _write('WARN', tag, info);
    }
  };
  /* }}} */

  /* {{{ public function error() */
  _self.error    = function(tag, info) {
    if (ERROR & _options.level) {
      _write('ERROR', tag, info);
    }
  };
  /* }}} */

  /* {{{ public function close() */
  _self.close   = function() {
    if (_interval) {
      clearInterval(_interval);
      _interval = null;
    }
    if (_stream) {
      _flush_stream();
      _stream.end();
      _stream   = null;
    }
  }
  /* }}} */

  return _self;

}

exports.blackhole   = function() {
  return {
    'debug'     : function() {},
    'notice'    : function() {},
    'warn'      : function() {},
    'error'     : function() {},
    'close'     : function() {},
  };
}
