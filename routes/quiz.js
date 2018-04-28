/* eslint-disable */
var express = require('express');
var router = express.Router();
const Question = require('../models/question');
const User = require('../models/user');
//const Score = require('../models/score');
//var async = require('async');

//restrict accces to home page
let restrictAccess = function(req,res, next){
	if(req.user){
    next();
	}
	else{
    res.redirect('/auth/login');
	}
}
/* GET home page. */
router.get('/', restrictAccess, function(req, res) {
  Question.find({}).exec((err,allQuests)=>{
    console.log(allQuests)
    console.log(req.user.currQuestNo);
    var diff = req.user.startTime - req.user.currTime
    console.log('the diff ' + diff);
    if(req.user.currQuestNo > allQuests.length || diff < 0){ // check if he has answered all the questions or his time is up
      res.redirect('/quiz/completed')
    }else{
      Question.find({}).skip(req.user.currQuestNo * 1 -1).limit(1).exec((err, question)=>{
        console.log(question);
          res.render('quiz', {
            title:'Quiz',
            question:question,
            score:req.user.latestScore,
            currQuestNo:req.user.currQuestNo,
            currTime:req.user.currTime,
            startTime:req.user.startTime
          });      
      });
    }
  });
  
});

router.post('/next', restrictAccess, (req,res,next)=>{
  Question.find({}).exec((err,allQuests)=>{
    console.log(req.user.currQuestNo);
    console.log(allQuests[req.user.currQuestNo - 1].theAnswer)
    console.log(req.body.thierChoice);
    User.findOneAndUpdate({_id:req.user._id}, 
      {
        currQuestNo:req.user.currQuestNo * 1 + 1,
        startTime:req.body.startTime,
        currTime:req.body.currTime,
        //score the user if he gets the right answer
        //let newScore = req.body.thierChoice == allQuests[req.user.currQuestNo - 1].theAnswer ? req.user.latestScore * 1 + 1 : req.user.latestScore
        latestScore:req.body.thierChoice == allQuests[req.user.currQuestNo - 1].theAnswer ? req.user.latestScore * 1 + 1: req.user.latestScore}, (err,user)=>{
      //console.log(user.currQuestNo);
      if(req.user.currQuestNo == allQuests.length){
      //  res.send({redirect:'/'})
      console.log('true')
      res.status(200).send({
        question: null,
        completed:true,
        currQuestNo:req.user.currQuestNo* 1  + 1,
        currTime:user.currTime,
        startTime:user.startTime
      });
      }
      else{
        Question.find({}).skip(user.currQuestNo).limit(1).exec((err,question)=>{
          console.log(question[0]);
          res.status(200).send({
            question: question[0],
            currQuestNo:user.currQuestNo* 1  + 1,
            currTime:user.currTime,
            startTime:user.startTime
          });
        })
      }
      
    })
  })
})


// welcome
router.get('/welcome', restrictAccess, (req,res,next)=>{
  res.render('welcome', {title:'Quiz | RCCG Lighthouse AI'})
})
// Test completed
router.get('/completed', restrictAccess, (req,res,next)=>{
  res.render('testcompleted', {
    title:'Test Completed'
  })
})

module.exports = router;
