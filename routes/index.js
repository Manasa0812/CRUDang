var express = require('express');
var router = express.Router();
var monk=require('monk');
var ran=require('randomstring');
var nodemailer=require('nodemailer');
var moment=require('moment');
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
var qr=require('qrcode');
var multer=require('multer');
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage })

 

var db=monk('localhost:27017/codeheat');
var col=db.get('ang');
var col1=db.get('signup');
var collec=db.get('bday');
var bpres=db.get('pre_bday')
var byes=db.get('yes_bday');
var btom=db.get('tom_bday');
var pic=db.get('picture');
// var certi=db.get('certificate');
// var col2=db.get('login');
/* GET home page. */

router.get('/index', function(req, res, next) {
  res.render('index');
});

router.get('/qrcode',function(req,res){
	qr.toDataURL('sairam is stupid fellow', function (err, url) {
  //console.log(url);
  res.render('qrcode',{'a':url})
});
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
	});``
});
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
	console.log(req.body.email);
	console.log(req.body.name);
	var data={
	 name:req.body.name,
	 em:req.body.email,
	 pass:cryptr.encrypt(req.body.pass)
	}
	console.log(req.body.pass);
	col1.insert(data,function(err,docs){
       if(err){
       	console.log(err)
       }else{
       	res.send(docs)
       	console.log(docs)
       }
	});
});


router.post('/postlogin',function(req,res){
 //console.log(req.body.email);
 //console.log(req.body.pass);
var em1=req.body.email;
col1.find({"em":em1},function(err,data){
	var p1=req.body.pass;
	var p2=cryptr.decrypt(data[0].pass);
	delete data[0].pass;
	req.session.user=data[0];
	if(p1==p2){
		res.send(data)
	}else{
		console.log(err)
	}
});
// col1.findOne({"email":em1,"pass":p1},function(err,docs){
// 	if(docs){
// 		console.log(docs);
// 		res.send(docs)
// 	}else{
// 		console.log("login not successful");
// 		res.sendStatus(500)
// 	}
// })
 })

router.get('/sendlog',function(req,res){
	if(req.session && req.session.user){
		console.log(req.session.user);
		res.locals.user=req.session.user;
		res.render('index');
	}else{
		req.session.reset();
		res.redirect('/');
	}
	
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
	col1.update({"email":mail1},{$set:{"pass":otp}},function(err,docs){
		if(err){
			console.log(err)
		}else{
		console.log(otp);
		console.log("success")
			res.send(docs);
		}
	});
	var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saimanasabatchu@gmail.com',
    pass: ''
  }
});

var mailOptions = {
  from: 'saimanasabatchu@gmail.com',
  to: req.body.mail,
  subject: 'this is manu',
  text: "changed password"+otp
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});

});

router.get('/back_forget',function(req,res){
	res.redirect('/');
});
//----------------------------------------------------------------------------bday ---------------------------------------------------------------------------------------------------
router.get('/bday',function(req,res){
	res.render('bday');
});
 router.post('/postbday',function(req,res){
 	 console.log(req.body.dob);
 	 var birth=moment(req.body.dob).format('DD-MM');
 	 const date_yes=moment().subtract(1,'days').format('DD-MM')
 	 var date=moment().format('DD-MM');
 	 const date_tum=moment().add(1,'days').format('DD-MM')
var data1={
	name:req.body.name,
	email:req.body.email,
	mobile:req.body.mobile,
	dob:moment(req.body.dob).format()
}

 	collec.insert(data1,function(err,docs){
 		if(err){
 			console.log(err)
 		}else{
 			res.send(docs);
 			 // console.log(docs);
 			console.log("submitted")
 	}
 	if(birth==date){
     bpres.insert(req.body,function(err,docs1){
        if(err){
        	console.log(err)
        }else{
        	console.log(docs1);

        }

        var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'saimanasabatchu@gmail.com',
    pass: 'manasa999'
  }
});

var mailOptions = {
  from: 'saimanasabatchu@gmail.com',
  to: req.body.email,
  subject: 'this is manu',
  text: "Many more happy returns of the day"+  req.body.name
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});	
});
}
});

 	if(birth==date_yes){
 		byes.insert(data1,function(err,docs2){
 			if(err){
 				console.log(err)
 			}else{
 				console.log(docs2)
 			}
 		});
 	}
 	if(birth==date_tum){
 		btom.insert(data1,function(err,docs3){
 			if(err){
 				console.log(err)
 			}else{
 				console.log(docs3);
 			}
 		});
 	}

 });

  //   router.get('/getbday',function(req,res){
 	// bpres.find({},function(err,docs){
 	// 	if(err){
 	// 		console.log(err)
 	// 	 	}else{
 	// 	 		res.send(docs);
 	// 	 	};
 	// 	 	});
  //    });s
 
 router.get('/getyes',function(req,res){
 	byes.find({},function(err,docs){
 		if(err){
 			console.log(err)
 		}else{
 			res.send(docs);
 		}
 		});
 	});

router.get('/gettom',function(req,res){
 	btom.find({},function(err,docs){
 		if(err){
 			console.log(err)
 		}else{
 			res.send(docs);
 		}
 		});
 	});
router.get('/getbday',function(req,res){
	 var date=moment().format('DD-MM');
 	collec.find({"dob":date},function(err,docs){
 		if(err){
 			console.log(err)
 		 	}else{
 		 		console.log(docs);
 		 		res.send(docs);
 		 		console.log("doneeeeeeeeeeeeeeee papppppuuugannuuu")
 		 	};
 		 	});
     });

// collec.find({},{projection:{dob:date}}).toArray(function (err, result){
// if(err)
// Console.log(err)
// else
// Console.log(result)
// console.log("success")
// });
// });

//----------------------------------------------------image upload----------------------------------------------------------------------------------------
router.get('/im',function(req,res){
	
	pic.find({},function(err,docs){
		res.render('im',{"a":docs})
	})
});

router.post('/im-upload', upload.single('image'), function (req, res, next) {
   console.log(req.file);
   var data={
   	image:req.file.originalname,
   	des:req.body.des
   }
    pic.insert(data,function(err,docs){
   	if(err){
   		console.log(err);
   	}else{
   		console.log(docs);
   	}
   });
  res.redirect('/im');
});


// -----------------------------------------------------multer certificate for psp------------------------------------------------------------------
// router.get('/stu_certi',function(req,res){
	
// 	certi.find({},function(err,docs){
// 		res.render('stu_certi',{"b":docs})
// 	})
// });

// router.post('/certi-upload', upload.single('image'), function (req, res, next) {
//    console.log(req.file);
//    var data={
//    	certi:req.file.originalname,
//    	descript:req.body.descript
//    }
//     certi.insert(data,function(err,docs){
//    	if(err){
//    		console.log(err);
//    	}else{
//    		console.log(docs);
//    	}
//    });
//   res.redirect('/stu_certi');
// });
module.exports = router;
