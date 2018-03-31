const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const moment = require('moment');
const Sermon = require('../models/sermon');
const Comment = require('../models/comment');
const Image = require('../models/image');
//const Recaptcha = require('express-recaptcha');
//const recaptcha = new Recaptcha(process.env.siteKey,process.env.secret);

/* GET home page. */
router.get('/', function(req, res, next) {
  Sermon.find({}).sort({index:-1}).limit(2).exec(function(err,sermons){
    if(err) throw err;
    //console.log(sermons)
    res.render('index', {
      title: 'Home | RCCG Lighthouse Parish',
      sermons:sermons,
      path:'home'
    });
  }); 
  
});

//get about 
router.get('/about', (req,res,next)=>{
  res.render('about', {title:'About Us | RCCG Lighthouse Parish'})
});
router.get('/events', (req,res,next)=>{
  res.render('events', {title:'Upcomming Events'});
});

// Get all sermons
router.get('/sermons', (req,res,next)=>{
  Sermon.find({}).sort({index:-1}).exec(function(err,sermons){
    //console.log(sermons);
    res.render('sermons', {
      title:'Sermons',
      sermons:sermons,
      msg:'Sorry, no sermon for this category yet'
    });
  });
});

// Get sermon in categories
router.get('/sermons/filter/:filter', (req,res,next)=>{
  Sermon.find({$or:[{category:req.params.filter}, {by:req.params.filter},{series:req.params.filter}]}).sort({index:-1}).exec(function(err, sermons){
    if(err) throw err;
    res.render('sermons', {
      title:'Sermons',
      sermons:sermons,
      msg:'Sorry, no sermon for this category yet'
    });
  });
});
// Read sermon
router.get('/sermons/:sermonLink'  /*, recaptcha.middleware.render*/, (req,res,next)=>{
  Sermon.findOne({link:req.params.sermonLink}).exec(function(err, sermon){
    if(err) throw err;
    //console.log(sermon);
    Comment.find({sermonRef:req.params.sermonLink}).sort({index:-1}).exec(function(err, comments){
      if(err) throw err;
      //console.log(comments);
      res.render('readsermon', {
        title:'Sermons',
        sermon:sermon,
        comments:comments,
        //captcha:res.recaptcha
      });
    })
    
  });
});
//Post Comments
router.post('/sermons/:sermonLink', /*recaptcha.middleware.verify,*/ (req,res,next)=>{
  // TODO ----> Run Valildation For Errors
  let comment = new Comment({
    name:req.body.name,
    comment:req.body.comment,
    email:req.body.email,
    sermonRef:req.params.sermonLink,
    index:new Date().getTime(),
    date:moment().format("D MMM YYYY")
  });
  req.checkBody('name', 'This cannot be empty').notEmpty();
  req.checkBody('comment', 'This cannot be empty').notEmpty();
  req.checkBody('email', 'please provide a valid email address').isEmail();

  let errors = req.validationErrors();
  if(errors){
    //there are errors in the form
    res.render('readsermon', {
      errors:errors,
      comment:comment
    });
  }
  else{
    // there are no errors in the form
    // check reCaptcha
    /*if(!req.recaptcha.error){
      res.render('readsermon', {
        errors:errors,
        comment:comment,
        captcha: 'please complete recatcha'
      });
    }*/
    //else{
      comment.save(function(err,done){
        if(err) throw err;
        res.redirect('/sermons/' + req.params.sermonLink);
      });
    //}
    
  }
  
  

});


// Get gallery
router.get('/gallery', (req,res,next)=>{
  Image.find({}).sort({index:-1}).exec(function(err,images){
    //console.log(images);
    res.render('gallery', {title:'Photo Gallery',images:images});
  });
})
router.get('/contact', (req,res,next)=>{
  console.log(req.url)
  res.render('contact', {title:'Contact Us'})
});


/* Send Mails*/

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.email,
    pass: process.env.password
  }
});
router.post('/contact', (req,res,next)=>{
  // setup email data
  req.checkBody('fname', 'Please Enter your first name').notEmpty();
  req.checkBody('lname', 'Please Enter your last name').notEmpty();
  req.checkBody('email', 'Please Enter a valid email address').isEmail();
  req.checkBody('msg', 'Please Enter your message').notEmpty();
  let errors = req.validationErrors();
  if(errors){
    console.log(errors);
    res.render('contact', {
      errors:errors,
      msg:'please edit input',
      lname:req.body.lname,
      fname:req.body.fname,
      email:req.body.email,
      msg:req.body.msg
    });
  }
  else{
    var mailOptions = { 
      from: req.body.email,
      to: process.env.email,
      subject: 'I Am New Here',
      text: `Hi, I am ${req.body.fname} ${req.body.lname}. 
        ${req.body.msg}` 
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        //console.log(error);
      }
      else {
        //console.log('Email sent: ' +  info.response +', ' + info.messageId);
        res.render('success', {
          title:'Email recieved',
          msg:'Thank you for your interest!. We will get in touch soon'
        });
      }
    });
  }
  
});
router.post('/contact/newsletter', (req,res,next)=>{
  // setup email data
    var mailOptions = { 
      from: req.body.mail,
      to: process.env.email,
      subject: 'I subscribe to the monthly newsletter',
      text: `Hi,
      I wish to subscribe to the monthly newsletter` 
    };
  
    // send mail with defined transport object
    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        //console.log(error);
      }
      else {
        //console.log('Email sent: ' +  info.response +', ' + info.messageId);
        res.render('success', {
          title:'Email recieved',
          msg:'Thank you for your interest!. We will get in touch soon'
        });
      }
    });
  
});

module.exports = router;
