/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var should  = require('should');
var Context	= require(__dirname + '/../../lib/context.js');

describe('global context', function() {

  /* {{{ should_context_set_and_get_works_fine() */
  it('should_context_set_and_get_works_fine', function() {
    Context.clean();

    should.ok(!Context.get('id1'));
    Context.set('id1', 'int', 0);
    Context.get('id1').should.eql({
      'int' : 0,
    });
    Context.get('id1', 'int').should.eql(0);
    should.ok(!Context.get('id1', 'int2'));

    Context.set('id1', 'obj', {'a' : 1});
    Context.clean('id1', 'int');
    Context.get('id1').should.eql({
      'obj' : {'a' : 1},
    });
    Context.clean('id1');
    should.ok(!Context.get('id1'));
    should.ok(null === Context.get());
  });
  /* }}} */

  /* {{{ should_context_push_works_fine() */
  it('should_context_push_works_fine', function() {
    Context.clean();

    Context.set('k1', 'c1', 2);
    Context.get('k1', 'c1').should.eql(2);
    Context.push('k1', 'c1', 1);
    Context.get('k1', 'c1').should.eql([2,1]);

    Context.push('k1', 'c2', {'a' : 1});
    Context.get('k1', 'c2').should.eql([{'a' : 1}]);
    Context.push('k1', 'c2', [2]);
    Context.get('k1', 'c2').should.eql([{'a' : 1},[2]]);

    Context.set('k1', 'c3', [2]);
    Context.get('k1', 'c3').should.eql([2]);
    Context.push('k1', 'c3', 1);
    Context.get('k1', 'c3').should.eql([2,1]);
  });
  /* }}} */

});

