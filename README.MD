```javascript
new Flow(function(next){
	next(null, "hello", "world");
})
.then(function(res1, res2, next){
	next(null, res1 + " " + res2);
})
.on("finish", function(res){
	console.log(res);
})
.run();
```
