var express = require('express');
var router = express.Router();
var monk=require('monk');
var db=monk('localhost:27017/codeheat');
var col=db.get('ang');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});
router.get('/getdata',function(req,res){
	col.find({},function(err,docs){
		if(err){
			console.log(err)
		}
		else{
			// console.log(docs)
			res.send(docs)
			console.log("success doneeeee");
		}
	})
})
router.post('/postdata',function(req,res){
	console.log(req.body);
	col.insert(req.body,function(err,docs){
		if(err){
			console.log(err);
		}else{
			console.log("success");
			// console.log(docs);
			res.send(docs);
		}
	});
});
router.delete('/deldata/:id',function(req,res){
	console.log(req.params.id)
	col.remove({"_id":req.params.id},function(err,docs){
		if(err){
			console.log(err)
		}else{
			res.send(docs);
			console.log("deleted successfully");
		}
	})
});

module.exports = router;
