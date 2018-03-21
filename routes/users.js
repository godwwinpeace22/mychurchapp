const express = require('express');
const router = express.Router();
const passport = require('passport');
const bcrypt = require('bcryptjs');
const flash = require('connect-flash');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');

//restrict accces to admin only
let restrictAccess = function(req,res, next){
	if(req.user){
	  next();
	}
	else{
	  res.redirect('/auth/login');
	}
}
let requireLogOut = function(req,res,next){
	if(req.user){
		res.redirect('/dashboard'); // Redirect to the dashbaord if the user is aleady logged in
	}
	else{
		next()  // Run the next middleware if the user is logged in
	}
}

//allow access to Master only.
let masterLogin = function(req,res,next){
	bcrypt.compare(process.env.masterPassword,  function(err, response) {
		if(err) throw err;
		console.log(response);
		// res === true || res === false
		if(req.user.username == process.env.masterUsername && response == true){
			next();
		}
		else{
			res.redirect('/auth/login');
		}
	});
}


//get auth
router.get('/', restrictAccess,masterLogin, (req,res,next)=>{
	res.redirect('/auth/addusers');
});
// Add users
router.get('/addusers', restrictAccess, masterLogin, function(req,res,next){
	res.render('addusers',{
	  title:'Create users'
	});
});

router.post('/addusers', restrictAccess, function(req,res,next){
	req.checkBody('name', 'Please provide your full name').notEmpty();
	req.checkBody('username', 'Please provide a username').notEmpty();
	req.checkBody('email', 'Please provide a valid email address').isEmail();
	req.checkBody('password', 'password cannot be empty').notEmpty();
	req.checkBody('password2', 'passwords do not match').equals(req.body.password);
  
	//create a new user
	let user = new User({
	  name: req.body.name,
	  username:req.body.username,
	  email: req.body.email,
	  password: req.body.password
	});
  
	//Run the validators
	let errors = req.validationErrors();
	
	//if there are errors in the form
	if(errors){
	  res.render('addusers',  {
		title: 'Create Users',
		errors: errors,
		name:req.body.name,
		username:req.body.username,
		email:req.body.email
	  });
	  return;
	}
  
	//there are no errors
	else{
	  //check if ther username is already taken
	  User.findOne({'username': req.body.username}, function(err, result){
		if(err){return next(err)}
		User.count({name:req.body.name}, function(err, sameNameNo){
		  console.log('we found this boy with the same name' + sameNameNo);
		})
		//if the username is truely already in user by another user
		if(result){
		  console.log('username is already taken');
		  res.render('addusers',{
			title:'Create Users',
			msg: 'Username already taken. Please try another one',
			name:req.body.name,
			username:req.body.username,
			email:req.body.email
		  });
		}
  
		//the username is not taken
		else{
		  bcrypt.hash(user.password, 10, function(err, hash){
			if(err) throw err;
			//set hashed password
			user.password = hash;
			user.save(function(err){
			  if(err){return next(err)}
			  console.log(user);
			  //res.redirect('/users/login');
			  req.login(user, function(err) {
				if (err) { return next(err); }
				return res.redirect('/dashboard');
			  });
			});
		  })
		  
		} 
	  });
	}
  });


  //handle login route
passport.serializeUser(function(user, done){
	done(null, user.id);
});
passport.deserializeUser(function(id, done){
	User.findById(id, function(err, user){
		done(err, user);
	});
});
passport.use(new LocalStrategy(
	function(username, password, done){
		User.findOne({username: username}, function(err, user){
			if(err) {return done(err)}
			if(!user){
				console.log('incorrect username');
				return done(null, false, {message: 'Incorrect username.'});
			}
			bcrypt.compare(password, user.password, function(err, res) {
				if(err) throw err;
				console.log(res);
				// res === true || res === false
				if(res !== true){
				return done(null, false, {message: 'Incorrect password.'});
				}
				else{
				console.log('user has been successfully authenticated');
				return done(null, user);
				}
			});
		});
	}
));
  
router.get('/login', requireLogOut, function(req, res, next){
	res.render('login', {
		title: 'Login',
		isLoggedIn:req.user? req.user : ''
	});
});
  router.post('/login', requireLogOut,
	passport.authenticate('local', {failureRedirect:'/auth/login', failureFlash:'authentication failed'}),
	function(req, res) {
	  console.log('authentication successful!')
	  console.log(req.user);
	  // If this function gets called, authentication was successful.
	  // `req.user` contains the authenticated user.
	 // res.redirect('/users/' + req.user.username);
	 res.redirect('/dashboard');
  });
  
  router.get('/logout', function(req, res, next){
	req.session.destroy(function(err){
	  console.log('user logged out... session deleted.')
	  res.redirect('/')
	});
  });
  
  
module.exports = router;