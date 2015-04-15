var db = require('../models');
var express = require('express');
var router = express.Router();
var bodyParser = require("body-parser");
var yelp = require("yelp").createClient({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});

router.use(bodyParser.urlencoded({ extended: false }));

router.get('/',function(req,res){
  if(req.getUser()){
    var user = req.getUser();
    var alerts = req.flash();
    db.post.findAll().then(function(posts){
      console.log("here are the posts:",posts);
      res.render('/main',{user:user, alerts:alerts});
    })
  }else{
    req.flash('danger', 'You must be logged in to access this content.')
    res.redirect('/');
  }

});

router.post('/show', function(req,res){
if(req.getUser()){
    var user = req.getUser();
    var alerts = req.flash();
    var info;

    yelp.search({term: req.body.restaurant, location: "seattle"}, function(error, data) {
      info = data.businesses.map(function(data){
        return {name: data.name,
                image: data.image_url,
                rating: data.rating,
                location: data.location
              }
      })
      console.log(info[0].location)
      res.render("main/show", {user: user, alerts: alerts, info: info})
  });

  }else{
    req.flash('danger', 'You must be logged in to access this content.')
    res.redirect('/');
  }
})

router.get('/show/:id', function(req,res){
if(req.getUser()){
    var user = req.getUser();
    var alerts = req.flash();
    var id = req.params.id
    var info;

    yelp.search({term: id, location: "seattle"}, function(error, data) {
      info = data.businesses.map(function(data){
        return {name: data.name,
                image: data.image_url,
                rating: data.rating,
                location: data.location
              }
      })
      console.log(info[0].location)
      res.render("main/show", {user: user, alerts: alerts, info: info})
  });

  }else{
    req.flash('danger', 'You must be logged in to access this content.')
    res.redirect('/');
  }
})

router.post('/post',function(req,res){
  var message = req.body.postMessage;
  var activity = req.body.postActivity;
  yelp.search({term: req.body.postBusiness, location: "seattle"}, function(error, data) {
      info = data.businesses.map(function(data){
        return {name: data.name,
              }
      })
        db.post.findOrCreate({where: {message: message,
                                business: info[0].name,
                                type: activity,
                                userId: req.session.user.id}})
    .spread(function(createdPost, created){
      // res.send(createdPost)
      res.render("post", {post: createdPost, userName: req.getUser().userName})
    })

  });
});

router.post('/post/comment',function(req,res){
  var message = req.body.commentMessage;
  var postId = req.body.postId;
  var user = req.session.user.id;
  db.comment.findOrCreate({where: {message:message,
                                   userId:user,
                                   postId: postId
                          }})
    .spread(function(createdComment, created){
      res.send(createdComment)
      // res.render("comment", {comment: createdComment, userName: req.getUser().userName})
    })

  });

router.get('/logout',function(req,res){
    delete req.session.user;
    res.redirect('/');
});


module.exports = router;