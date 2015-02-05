/* globals it:false, describe:false */
/* jshint -W030 */
require("should");
var Flow = require("../lib/callback-flow");

describe("basic", function(){
	it("simple", function(done){
		new Flow(function(next){
			next(null, "hello");
		}).then(function(res, next){
			next(null, res + " " + "world");
		}).on("finish", function(res){
			res.should.be.exactly("hello world");
			done();
		}).run();
	});

	it("error", function(done){
		new Flow(function(next){
			next(null, "hello");
		}).then(function(){
			throw new Error("fail");
		}).on("error", function(err){
			err.message.should.be.exactly("fail");
			done();
		}).run();
	});

	it("multiple result", function(done){
		new Flow(function(next){
			next(null, [1]);
		}).then(function(res, next){
			next(null, res.concat([2]));
		}).then(function(res, next){
			next(null, res.concat([3]));
		}).on("finish", function(res){
			res.should.be.eql([1, 2, 3]);
			done();
		}).run();
	});


	it("this context", function(done){
		var context = {};

		new Flow(context, function(next){
			this.test = "1";
			this.should.be.exactly(context);
			next(null, [1]);
		})
		.then(function(res, next){
			this.test += "2";
			this.should.be.exactly(context);
			next(null, res.concat([2]));
		})
		.then(function(res, next){
			this.test += "3";
			this.should.be.exactly(context);
			next(null, res.concat([3]));
		})
		.on("finish", function(res){
			this.getContext().should.be.exactly(context);
			this.getContext().test.should.be.exactly("123");
			res.should.be.eql([1, 2, 3]);
			done();
		}).run();
	});
});