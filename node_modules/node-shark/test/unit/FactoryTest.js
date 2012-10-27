/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var should  = require('should');
var Factory = require(__dirname + '/../../lib/factory.js');

beforeEach(function() {
  Factory.cleanAll();
});

describe('object factory', function() {

  /* {{{ should_factory_get_object_works_fine() */
  it('should_factory_get_object_works_fine', function() {
    should.ok(null === Factory.getObject('class/name'));
    Factory.setObject('c1/n1', {'a' : 1});

    var obj = Factory.getObject('c1/N1 ');
    obj.should.eql({'a' : 1});

    Factory.setObject('c1/n2', obj);

    obj.a   = 2;
    obj.should.eql({'a' : 2});
    Factory.getObject('    C1/n1').should.eql({'a' : 2});
    Factory.getObject('    C1/n2').should.eql({'a' : 2});

    Factory.cleanAll('c1/n2');
    should.ok(null === Factory.getObject('c1/n2'));
    Factory.getObject('    C1/n1').should.eql({'a' : 2});
  });
  /* }}} */

  /* {{{ should_get_clone_object_works_fine() */
  it('should_get_clone_object_works_fine', function() {
    var obj = {
      'a'   : 2,
    };
    Factory.setObject('a1', obj, true);

    obj.b   = 'b';
    Factory.getObject('a1').should.eql({'a' : 2});

    Factory.setObject('a1', obj);
    var _me = Factory.getObject('a1', true);
    _me.c   = 3;

    obj.c   = 'c';
    Factory.getObject('a1').should.eql({'a' : 2, 'b':'b','c':'c'});
  });
  /* }}} */

  /* {{{ should_factory_set_and_get_mysql_works_fine() */
  it('should_factory_set_and_get_mysql_works_fine', function(done) {
    Factory.setMysql('', {
      'query': function(a, cb) {
        cb(a);
      }
    });
    Factory.getMysql('').query('hell', function(str) {
      str.should.eql('hell');
      done();
    });
  });
  /* }}} */

  /* {{{ should_factory_set_and_get_log_works_fine() */
  it('should_factory_set_and_get_log_works_fine', function() {
    Factory.getLog('i am not defined').should.have.property('debug');

    function _debug() {
    }

    Factory.setLog('a1', {'a' : 1, 'debug' : _debug});
    Factory.getLog('a1').should.eql({'a' : 1, 'debug' : _debug});
  });
  /* }}} */

});

