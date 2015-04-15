var express = require("express");
var bodyParser = require("body-parser");
var yelp = require("yelp").createClient({
  consumer_key: process.env.YELP_CONSUMER_KEY,
  consumer_secret: process.env.YELP_CONSUMER_SECRET,
  token: process.env.YELP_TOKEN,
  token_secret: process.env.YELP_TOKEN_SECRET
});
var app = express();
var multer  = require('multer')
var session = require('express-session');
var flash = require('connect-flash');
var db = require("./models");
var bcrypt = require('bcrypt')
// var mainCtrl = require("./controllers/main");

app.use(express.static(__dirname + "/public"));

// app.use("/main", mainCtrl);
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ dest: './uploads/'}));
app.set("view engine", "ejs");
app.use(session({
  secret: "thisismysupersecretsalt:a;owiefja;woifjaw;oefijawo;eifjawo;e",
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
//custom middleware for "is user logged in"
app.use(function(req,res,next){

  //AUTO LOGIN REMOVE THIS LATER///
    // req.session.user={
    //   id:5,
    //   userName: "irismoondanga",
    //   firstName: "Iris",
    //   lastName: "McComb"
    // }
  /////////////////////////////////

  req.getUser = function(){
    return req.session.user || false;
  }
  next();
})
app.use('/main',require('./controllers/main.js'));

app.get("/", function(req,res){
  if(req.getUser()){
    var user = req.getUser();
    var alerts = req.flash();
    var myDate = new Date();
    myDate.setHours(myDate.getHours() - 1);

    // , where:{
    // createdAt:{
    //   $gt:myDate
    // }}

    db.post.findAll({
      include:[
        db.user,
        {model:db.comment,include:[db.user]}
      ]
    }).then(function(posts){
        posts = posts.map(function(postData){
          var post = postData.get();
          post.user = postData.user.get();
          post.comments = postData.comments.map(function(data){return data.get()});
          return post;
        })
        // db.comment.findAll({include:[db.user]}).then(function(comments){
        //   comments = comments.map(function(commentsData){
        //     var comment = commentsData.get();
        //     comment.user = commentsData.user.get();
        //     return comment;
        //   })

          console.log('posts',posts[0].comments[0].user)
          res.render('main/main',{user:user, alerts:alerts, posts: posts});
        })

  }else{
     res.render("index")


}
});

app.post('/signup',function(req,res){
    var userQuery={userName:req.body.username};
    var userData={
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password};
    db.user.findOrCreate({where:userQuery,defaults:userData})
      .spread(function(user, created){
        if(created){
          req.session.user = {
                  id: user.id,
                  userName: user.userName,
                  firstName: user.firstName,
                  lastName: user.lastName,
                }
          res.redirect("/")
        }else{
          res.send("e-mail already exists")
        }
      })
      .catch(function(error){
        console.log("error",  error);
        res.send(error)
      })
    // res.redirect('/');
});

app.post('/login',function(req,res){
    db.user.find({where: {userName: req.body.userName}})
      .then(function(user){
        if(user){
            bcrypt.compare(req.body.password, user.password, function(err,result){
              if(err) throw err;
              if(result){
                req.session.user = {
                  id: user.id,
                  userName: user.userName,
                  firstName: user.firstName,
                  lastName: user.lastName,
                }
                res.redirect("/")
                }else{
                res.send("We found you, but your password is wrong. What's up with that???")
              }
            })
        }else{
          res.send('unknown user. please sign up!')
        }
      })
});


app.listen(3000, function(){
  console.log("Listening on port 3000. SIPRMNCH is online.")
})