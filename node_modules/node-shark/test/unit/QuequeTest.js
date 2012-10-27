/* vim: set expandtab tabstop=2 shiftwidth=2 foldmethod=marker: */
// +--------------------------------------------------------------------+
// | (C) 2011-2012 Alibaba Group Holding Limited.                       |
// | This program is free software; you can redistribute it and/or      |
// | modify it under the terms of the GNU General Public License        |
// | version 2 as published by the Free Software Foundation.            |
// +--------------------------------------------------------------------+
// Author: pengchun <pengchun@taobao.com>

var should  = require('should');
var Queque	= require(__dirname + '/../../lib/queque.js');

describe('priority queque', function() {

	/* {{{ should_queque_push_and_fetch_works_fine() */
	it('should_queque_push_and_fetch_works_fine', function() {
		var queque	= Queque.create({'o' : '暂时都没啥用'});
    queque.size().should.eql(0);
    should.ok(!queque.fetch());

		queque.push('a', 1);
		queque.size().should.eql(1);
		queque.push('b', 0);
		queque.push('c', 10);
		queque.push('d', -1);
		queque.size().should.eql(4);
		queque.size(0).should.eql(2);

		queque.fetch().should.eql('b');
		queque.fetch().should.eql('d');
		queque.fetch().should.eql('a');
		queque.fetch().should.eql('c');
		should.ok(!queque.fetch());

		queque.size().should.eql(0);
	});
	/* }}} */

});
