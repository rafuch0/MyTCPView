/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

if (process.env.JSCOV) {
	var jscover = require('jscoverage');
	require = jscover.require(module);
}

var should  = require('should');
var Extend	= require(__dirname + '/../../lib/extend.js');

describe('object extends', function() {

  /* {{{ should_object_clone_works_fine() */
  it('should_object_clone_works_fine', function() {
    var ob1 = {
      'a' : 1, 'b' : '2',
    };

    var ob2 = ob1;
    var ob3 = Extend.clone(ob1);
    ob2.c   = 3;

    ob2.should.eql({'a' : 1, 'b' : '2', 'c' : 3});
    ob1.should.eql({'a' : 1, 'b' : '2', 'c' : 3});
    ob3.should.eql({'a' : 1, 'b' : '2'});
  });
  /* }}} */

  /* {{{ should_extend_clone_null_works_fine() */
  it('should_extend_clone_null_works_fine', function() {
    should.ok(null === Extend.clone(null));
    should.ok(undefined === Extend.clone(undefined));
    Extend.clone({}).should.eql({});

    // test case for new Number(1);
  });
  /* }}} */

  /* {{{ should_array_clone_works_fine() */
  it('should_array_clone_works_fine', function() {
    var ob1 = [1, 2, 3];
    var ob2 = ob1;
    var ob3 = Extend.clone(ob1);

    ob2.push(4);
    ob2.should.eql([1, 2, 3, 4]);
    ob1.should.eql([1, 2, 3, 4]);
    ob3.should.eql([1, 2, 3]);
  });
  /* }}} */

  /* {{{ should_function_clone_works_fine() */
  it('should_function_clone_works_fine', function() {
    var ob1 = function(a) {
      return 'hello ' + a;
    };

    var ob2 = ob1;
    var ob3 = Extend.clone(ob1);

    ob2('cc').should.eql('hello cc');
    ob2 = function(a) {
      return 'hi, ' + a;
    };
    ob2('cc').should.eql('hi, cc');
    ob3('cc').should.eql('hello cc');
  });
  /* }}} */

  /* {{{ should_buffer_concat_works_fine() */
  it('should_buffer_concat_works_fine', function() {
    var _me = Extend.concat();
    _me.all().should.eql(new Buffer(0));

    _me.push(new Buffer('abcd'));
    _me.all().toString().should.eql('abcd');

    var buf = new Buffer('测试多字节字符');
    _me.push();                     /**<    push undefined      */
    _me.push(buf.slice(0,7));       /**<    截断的多字节字符    */
    _me.all().toString().should.include('abcd测试');

    _me.push(buf.slice(7));
    _me.all().toString().should.eql('abcd测试多字节字符');
  });
  /* }}} */

  /* {{{ should_string_escape_works_fine() */
  it('should_string_escape_works_fine', function() {
    Extend.escape('i\'m 黒\\牛	1"2').should.eql('i\\\'m 黒\\\\牛\\t1\\"2');
  });
  /* }}} */

  /* {{{ should_clone_array_works_fine() */
  it('should_clone_array_works_fine', function() {
    var a1  = [1, 2, '3'];
    var a2  = a1;
    var a3  = Extend.clone(a1);
    a2.should.eql([1, 2, '3']);
    a3.should.eql([1, 2, '3']);

    a2[2]   = '4';
    a2.should.eql([1, 2, '4']);
    a1.should.eql([1, 2, '4']);
    a3.should.eql([1, 2, '3']);
  });
  /* }}} */

});
