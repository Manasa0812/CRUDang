var express = require('express');
var router = express.Router();
var monk=require('monk');
var ran=require('randomstring');
var nodemailer=require('nodemailer')

var db=monk('localhost:27017/codeheat');
var col=db.get('ang');
var col1=db.get('signup');
// var col2=db.get('login');
/* GET home page. */

router.get('/index', function(req, res, next) {
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
//----------------------------------------------login_sinup page------------------------------------

router.get('/',function(req,res){
	res.render('login_signup');
});
router.post('/postsignup',function(req,res){
	console.log(req.body);
	col1.insert(req.body,function(err,docs){
		if(err){
			console.log(err)
		}else{
			// console.log("success");
			// console.log(docs);
			res.send(docs);
		}
	});
});

router.post('/postlogin',function(req,res){
// console.log(req.body.email);
// console.log(req.body.pass);
var em1=req.body.email;
var p1=req.body.pass;
col1.findOne({"email":em1,"pass":p1},function(err,docs){
	if(docs){
		console.log(docs);
		res.send(docs)
	}else{
		console.log("login not successful");
		res.sendStatus(500)
	}
})
})

router.get('/sendlog',function(req,res){
	res.redirect('/index')
});

router.get('/comeout',function(req,res){
	res.redirect('/');
})
//-------------------------------------------forgot page--------------------------------
router.get('/forgot',function(req,res){
	res.render('forgot')
});
router.get('/loginpage',function(req,res){
	res.render('login_signup');
});

router.post('/postforgot',function(req,res){
	console.log(req.body.mail)
	var mail1=req.body.mail;
	var otp=ran.generate(5);
	console.log(otp);
	col1.update({"email":mail1},{$set:{"pass":otp}})
})
module.exports = router;
