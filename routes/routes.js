var express = require('express');
var router = express.Router();
var models = require('../models');
var User = models.User;

//////////////////////////////// PUBLIC ROUTES ////////////////////////////////
// Users who are not logged in can see these routes

router.get('/', function(req, res, next) {
  res.render('home');
});

///////////////////////////// END OF PUBLIC ROUTES /////////////////////////////

router.use(function(req, res, next){
  console.log('guard', req.user)
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

//////////////////////////////// PRIVATE ROUTES ////////////////////////////////
// Only logged in users can see these routes

router.get('/protected', function(req, res, next) {
  res.render('protectedRoute', {
    username: req.user.username,
  });
});


//get request to find all docs by user id in authors
//OR JUST FIND ALL DOCS THEN SORT
router.get('/viewdoc', function(req, res, next) {
  models.Document.find({authors: req.user._id}, function(error,result){
    if(error){
      res.status(500).send(error)
      return;
    }else{
      res.status(200)
      res.json({success: true, data: result})
      //console.log(result)
      return;
    }
  })

});

//add user id to authors too
router.post('/createdoc', function(req, res, next) {


  var d = new models.Document({
    owner:req.user._id,
    title: req.body.title,
    created: new Date(),
    authors:req.user._id,
    password: req.body.password
  });
  d.save(function(err, user) {
    if (err) {
      console.log(err);
      res.status(500)
      res.send('hey')
      return;
    } else{
      res.status(200)
      console.log(user);
      res.json({success: true, data: user})
      return;
    }

  });


});




//ADD DOC FROM ID AND PASSWORD
//finds the document then add to authors the id, so when you ge reuqest to view docs it finds it there
router.post('/adddoc', function(req, res, next) {
  console.log('hello')
  models.Document.findById(req.body.documentID)
      .then((result)=>{
        console.log(result)
        result.authors.push(req.user._id);
        return result
      })
      .then((result)=>result.save())
      .then(()=>res.json({success: true, data: null}))
      .catch((error)=>(res.send(error)))



})




//FInd document with DOC ID AND THEN UPDATE THE CONTENT
router.post('/savedoc', function(req, res, next) {
    console.log('line 106', req.body);
    models.Document.findById(req.body.documentID)
        .then((result)=>{
          console.log(result);
          if(result) console.log(result.contentHistory);
          result.contentHistory.push(req.body.editorState);
          result.saveDates.push(new Date());
///CHECK THIS
          return result.save()
        })
        .then(()=>res.json({success: true, data: null}))
        .catch((error)=>(res.send(error)))
})

router.post('/specificdoc', function(req, res, next) {
  console.log(req.body)
  models.Document.findById(req.body.documentID, function(error,result){
    if(error){
      res.json({success:false, data:null})
    }else{
res.json({success:true, data:result})
    }
  })


})














///////////////////////////// END OF PRIVATE ROUTES /////////////////////////////

module.exports = router;
