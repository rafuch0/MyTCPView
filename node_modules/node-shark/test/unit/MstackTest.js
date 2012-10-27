/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var should  = require('should');
var mstack  = require(__dirname + '/../../lib/mstack.js');

var ___STRINGS  = 'abcdefghijklmnopqrstuvwxyz0123456789~!@#$%^&*()_+|{}<>?';
function random(min, max) {
  var res   = [];
  var max   = parseInt(min + (max - min) * Math.random(), 10);
  for (var i = 0; i < max; i++) {
    var pos = parseInt(___STRINGS.length * Math.random(), 10);
    res.push(___STRINGS.slice(pos, pos + 1));
  }

  return res.join('');
}

describe('memory stack', function() {

  /* {{{ should_memory_stack_set_and_get_works_fine() */
  it('should_memory_stack_set_and_get_works_fine', function() {
    var _me = mstack.create(10);
    should.ok(!_me.get('key1'));
    _me.set('key1 ', 'value1').set(' key2', {'c' : 'd'});
    _me.get(' key1').should.eql('value1');
    _me.get('key2 ').should.eql({'c' : 'd'});
    _me.set('key1', 'value2').get('key1').should.eql('value2');
    should.ok(!_me.clean().get('key1'));

    _me.status().should.have.property('q');
    _me.status().should.have.property('s');
    _me.status().should.have.property('m');
  });
  /* }}} */

  /* {{{ should_mstack_clone_works_fine() */
  it('should_mstack_clone_works_fine', function() {
    var _me = mstack.create(10);
    _me.set('ob1', {'a' : 1});

    var ob1 = _me.get('ob1');
    ob1.should.eql({'a' : 1});
    ob1.b   = 2;
    ob1.should.eql({'a' : 1, 'b' : 2});

    _me.get('ob1').should.eql({'a' : 1});
  });
  /* }}} */

  /* {{{ should_mstack_lru_works_fine() */
  it('should_mstack_lru_works_fine', function() {
    var _me = mstack.create(2); // max : 3, min : 1
    _me.set('key1', '1');
    _me.get('key1').should.eql('1');
    _me.set('key2', '2');
    _me.get('key2').should.eql('2');
    _me.get('key2').should.eql('2');    // 多次查询key2, 淘汰key1
    _me.set('key3', '3');
    _me.get('key3').should.eql('3');
    _me.get('key2').should.eql('2');
    _me.set('key4', '4');
    _me.get('key2').should.eql('2');
    _me.get('key4').should.eql('4');

    should.ok(null === _me.get('key1'));
    should.ok(null === _me.get('key3'));
  });
  /* }}} */

});
