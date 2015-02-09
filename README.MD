[![Build Status](https://travis-ci.org/jeeeyul/callback-flow.svg)](https://travis-ci.org/jeeeyul/callback-flow)

```javascript
new Flow(function (next) {
	next(null, "hello", "world");
})
.then(function (res1, res2, next) {
	next(null, res1 + " " + res2);
})
.on("finish", function (res) {
	console.log(res);
})
.run();
```
