/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var should  = require('should');
var config	= require(__dirname + '/../../lib/config.js');

describe('file config', function() {

  /* {{{ should_js_config_works_fine() */
  it('should_js_config_works_fine', function() {
    var cfg	= config.create(__dirname + '/etc/test_config_file.js');

    cfg.get('i_am_not_defined', {'a':'b'}).should.eql({'a':'b'});
    cfg.get('key1', 0).should.eql(1);
    cfg.get('key2', '').should.eql('Kye2');
    cfg.get('key3').should.eql({
      "key4"	: "aa",
      "key5"	: "bb",
      "key6"	: 1.1223
    });
  });
  /* }}} */

  /* {{{ should_json_config_works_fine() */
  it('should_json_config_works_fine', function() {
    var cfg = config.create(__dirname + '/etc/test_config_file.json');
    cfg.get('a').should.eql(0);
    should.ok(!cfg.get('i am not defined'));

    var itm = cfg.get('b');
    itm.should.eql({
      'c' : [1, 2, "3", "我是周华健"]
    });

    itm.b   = 1;
    itm.should.eql({
      'c' : [1, 2, "3", "我是周华健"],
      'b' : 1,
    });

    // XXX: clone test
    cfg.get('b').should.eql({
      'c' : [1, 2, "3", "我是周华健"]
    });
  });
  /* }}} */

  /* {{{ should_ini_config_works_fine() */
  it('should_ini_config_works_fine', function() {
    var cfg	= config.create(__dirname + '/etc/test_config_file.ini');
    cfg.all().should.eql({
      'key1'    : '',
      'key2'    : 0.01,
      'key3'    : 10,
      'key4'    : -213,
      'sec1'    : {
        'key1'  : 'a=b"c',
        'key2'  : '1',
      },
      'sec1:default'    : {
        'key1'  : 'aa',
        'key3'  : 'bb',
      },
    });
  });
  /* }}} */

});
