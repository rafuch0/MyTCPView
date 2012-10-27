/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var should  = require('should');
var fs      = require('fs');
var Log     = require(__dirname + '/../../lib/log.js');

describe('file log', function() {

  /* {{{ should_log_create_and_write_works_fine() */
  it ('should_log_create_and_write_works_fine', function(done) {
    var _fn = __dirname + '/tmp/test.log';

    try {
      fs.unlinkSync(_fn);
    } catch (e) {}

    var _me = Log.create({
      'file'  : _fn, 'buffer' : 0,
    });

    _me.debug('bb', 'i will be ignore');
    _me.notice('aa', "i am a bad boy");

    setTimeout(function() {
      var _text = fs.readFileSync(_fn, 'utf-8');
      _text.should.not.include("DEBUG:\t");
      _text.should.include("NOTICE:\t");
      _text.should.include("\tAA\t\"i am a bad boy\"");
      done();
    }, 100);

  });
  /* }}} */

  /* {{{ should_set_log_level_works_fine() */
  it ('should_set_log_level_works_fine', function(done) {
    var _fn = __dirname + '/tmp/test.log';

    try {
      fs.unlinkSync(_fn);
    } catch (e) {}

    var _me = Log.create({
      'file'  : _fn, 'level' : Log.WARN | Log.ERROR,
    });

    _me.debug('aa', 'i will be ignore');
    _me.notice('bb', "i am a bad boy");
    _me.warn('cc', "i am a bad boy");
    _me.error('dd', "i am a bad boy");
    _me.close();
    _me.error('ee', "i am a bad boy");

    setTimeout(function() {
      var _text = fs.readFileSync(_fn, 'utf8');

      _text.should.not.include("DEBUG:\t");
      _text.should.not.include("NOTICE:\t");
      _text.should.include("WARN:\t");
      _text.should.include("ERROR:\t");
      _text.should.not.include("\tEE\t");

      done();
    }, 100);
  });
  /* }}} */

  /* {{{ should_log_append_write_works_fine() */
  it('should_log_append_write_works_fine', function(done) {
    var _fn = __dirname + '/tmp/test.log';
    try {
      fs.unlinkSync(_fn);
    } catch (e) {}

    var lg1 = Log.create({'file' : _fn, 'level' : Log.ALL});
    var lg2 = Log.create({'file' : _fn});
    lg1.error('LOG1');
    lg1.debug('DEBUG');
    lg2.error('LOG2');
    lg1.close();
    lg2.close();

    setTimeout(function() {
      var _text = fs.readFileSync(_fn, 'utf8');
      _text.should.include("\tLOG1\t");
      _text.should.include("\tLOG2\t");
      done();
    }, 100);
  });
  /* }}} */

  /* {{{ should_log_blackhole_works_fine() */
  it('should_log_blackhole_works_fine', function() {
    var _log = Log.blackhole();
    _log.should.have.property('debug');
    _log.should.have.property('notice');
    _log.should.have.property('warn');
    _log.should.have.property('error');
    _log.should.have.property('close');
  });
  /* }}} */

});
