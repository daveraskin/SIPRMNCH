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
var bcrypt = require('bcrypt');
var cloudinary = require('cloudinary');
var fs = require('fs')
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
});
app.use(function(req,res,next){
  res.locals.alerts=req.flash();
  next();
})
app.use('/main',require('./controllers/main.js'));

app.get("/", function(req,res){
  if(req.getUser()){
    var user = req.getUser();
    var alerts = req.flash();
    var myDate = new Date();
    myDate.setHours(myDate.getHours() - 1.5);

// , where:{
//     createdAt:{
//       $gt:myDate
//     }}

    db.post.findAll({
      include:[
        db.user,
        {model:db.comment,include:[db.user]}
      ], where:{
    createdAt:{
      $gt:myDate
    }}
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
          res.render('main/main',{user:user, alerts:alerts, posts: posts});
        })

  }else{
     res.render("index")


}
});



app.post('/signup',function(req,res){
    var userQuery={userName:req.body.username};
    var uploadedFile;
    if(req.files.pic){
      uploadedFile = __dirname+'/'+req.files.pic.path
    }else{
      uploadedFile = './public/images/defaultPic.jpg'
    }
    var newFile;


     cloudinary.uploader.upload(uploadedFile,function(result){
    console.log(result);
    newFile = result;
        var userData={
      userName: req.body.userName,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      password: req.body.password,
      picture: newFile.public_id};
    db.user.findOrCreate({where:{userName: req.body.userName},defaults:userData})
      .spread(function(user, created){
        if(created){
          req.session.user = {
                  id: user.id,
                  userName: user.userName,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  picture: user.picture
                }
          res.redirect("/")
        }else{
          req.flash('primary','Your username already exists.  Try again')
                res.redirect("/");
        }
      })
      .catch(function(error){
        console.log("error",  error);
        req.flash('primary','This account already exists!')
      })
  });


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
                  picture: user.picture
                }
                res.redirect("/")
                }else{
                req.flash('primary','Your username or password seems to be off.  \n\ Check your capslock and try again!')
                res.redirect("/");
              }
            })
        }else{
          req.flash('primary','Your username or password seems to be off.  \n\ Check your capslock and try again!')
          res.redirect("/");
        }
      })
});


app.listen(process.env.PORT || 3000, function(){
  console.log("Listening on port 3000. SIPRMNCH is online.")
})