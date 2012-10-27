/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var fs      = require('fs');
var extend  = require(__dirname + '/extend.js');

exports.create  = function(file) {

  /* {{{ config file parse() */
  var value = {};
  var _call = null;
  switch (file.split('.').pop().trim().toLowerCase()) {
    case 'json':
      _call = parse_json_file;
      break;

    case 'ini':
      _call = parse_ini_file;
      break;

    default:
      _call = parse_js_file;
      break;
  }

  value   = _call(file);
  /* }}} */

  var _me   = {};
  _me.get   = function(key, _default) {
    return (undefined === value[key]) ? _default : extend.clone(value[key]);
  };

  _me.all   = function() {
    return value;
  };

  return _me;
}

/* {{{ function parse_js_file() */
function parse_js_file(fname) {
  return require(fname);
}
/* }}} */

/* {{{ function parse_json_file() */
function parse_json_file(fname) {
  var _text = fs.readFileSync(fname, 'utf8').trim().replace(/'/g, '"');
  return JSON.parse(_text);
}
/* }}} */

/* {{{ function parse_ini_file() */
function parse_ini_file(fname) {
  var data  = {};
  var sect  = null;

  var lines = fs.readFileSync(fname, 'utf8').trim().split('\n');
  lines.forEach(function(line) {
    line = line.trim();
    if (!line.length || ';' == line.slice(0, 1)) {
      return;
    }

    var match = line.match(/^\s*\[([^\]]+)\]\s*$/);
    if (match) {
      sect  = match[1];
      data[sect] = {};
    } else {
      var match = line.match(/^\s*(\w+)\s*=\s*(.*)\s*$/);
      if (!match) {
        return;
      }

      var key = match[1];
      var tmp = _clean(match[2]);
      if (sect) {
        data[sect][key] = tmp;
      } else {
        data[key] = tmp;
      }
    }
  });
  return data;
}
/* }}} */

/* {{{ function _clean() */
function _clean(val) {

  if (/^-?(\d|\.)+$/.test(val)) {
    return val - 0;
  }

  var _me   = [];

  val = val.replace(/^("|')+/, '').replace(/("|')+$/, '');
  for (var i = 0; i < val.length; i++) {
    var the = val.slice(i, i + 1);
    if ('\\' == the) {
      i++;
      _me.push(val.slice(i, i + 1));
    } else {
      _me.push(the);
    }
  }

  return _me.join('');
}
/* }}} */

