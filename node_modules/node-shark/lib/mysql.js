/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

exports.create  = function(options) {

  var mysql = require('xuyi-libmysqlclient');
  var _conf = {
    'host'      : '127.0.0.1',
    'port'      : 3306,
    'user'      : 'root',
    'password'  : '',
    'dbname'    : '',
    'poolsize'  : 4,
    'charset'   : 'UTF8',
  };
  for (var i in options) {
    _conf[i]    = options[i];
  }
  if (_conf.poolsize < 2) {
    _conf.poolsize  = 2;
  }

  var _self   = {};

  /* {{{ private connect pool() */
  var _conn = [];
  var _reqn = 0;
  for (var i = 0; i < _conf.poolsize; i++) {
    var _db = mysql.createConnectionSync();
    _db.connectSync(_conf.host, _conf.user, _conf.password, _conf.dbname, _conf.port);
    _db.setCharsetSync(_conf.charset);
    if (_db.connectedSync()) {
      if (2 == _conn.push(_db)) {
        process.nextTick(review_queued_query);
      }
    }
  }
  /* }}} */

  var _sqls = [];
  function review_queued_query() {
    var the = _sqls.shift();
    if (!the) {
      return;
    }
    _self.query(the.shift(), the.pop());
    process.nextTick(review_queued_query);
  }

  /* {{{ public function query() */
  _self.query = function(sql, callback, sync) {
    if (!_conn.length) {
      _sqls.push([sql, callback]);
      return;
    }

    var _db = _conn[(_reqn++) % _conn.length];
    if (sync) {
      var res   = _db.querySync(sql);
      if (!res) {
        callback(new Error('Query error #' + _db.errnoSync() + ': ' + _db.errorSync()));
      } else if (res.fieldCount > 0) {
        var tmp = res.fetchAllSync();
        if (!tmp) {
          callback(new Error('Query error #' + _db.errnoSync() + ': ' + _db.errorSync()));
        } else {
          callback(null, tmp);
        }
      } else {
        callback(null, res);
      }
    } else {
      _db.querySend(sql, function(err, res) {
        if (err) {
          callback(err, null);
        } else if (res.fieldCount > 0) {
          res.fetchAll(function(err, rows) {
            callback(err, rows);
          });
        } else {
          callback(null, res);
        }
      });
    }
  };
  /* }}} */

  return _self;
}

exports.blackhole   = function() {
  return {
    'query' : function(sql, callback) {
      callback(new Error('MysqlBlackhole'));
    },
  };
}

