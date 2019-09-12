// Starting point of the application
var express = require("express");
var app = express();
var path = require("path");
var port = 8000;
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
const fs = require("fs");
var bcrypt =require("bcrypt");
var nodemailer =require("nodemailer");
mongoose.Promise = global.Promise;
mongoose.connect("mongodb://localhost:27017/userprofile");
/*mongoose.connect("mongodb+srv://beanforkaccess:Admin@123@beanfork-ddksd.mongodb.net/test?retryWrites=true&w=majority",{
  useNewUrlParser:true
})*/

var nameSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  code: String,
  post: [
    {topic: String,
     description: String
    }
  ]
});

var userprofile = mongoose.model("User", nameSchema);
// app.use(express.static(__dirname+"public"))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "../client/public")));

app.get("/",(req,res)=>{
    res.sendFile(path.join(__dirname,"../client/views/register.html"))
})
const html = fs.readFileSync(path.join(__dirname, "../client/views/home.html"));

app.post("/home", (req, res,next) => {
  userprofile.findOne({ username: req.body.username }, function(err, result) {
    console.log("findone", result);
    if (result) {
      console.log("username exist");
      console.log(req.body.password);
      var password = bcrypt.compareSync(req.body.password, result.password)
      if (password) {
        console.log("password exists");
        //res.send({state:false,content:res.sendFile(path.join(__dirname, "../client/views/home.html"))});
        res.json({html:html.toString(),state:false,id: result._id})
        //res.sendFile(path.join(__dirname, "../client/views/home.html"));
        // res.re

      } else {
        next({status : 404,message :"username or password not found"})
       // res.send({state: true});
        //console.log("password not exist");
      }
    } else {
      next({status : 404,message :"username or password not found"})
      //res.send({state: true});
    }
  });
});

// app.post("/home",(req,res,next)=>{
//   console.log(req.body);
//     userprofile.findOne({ username: req.body.username }, function(err, result) {
//     console.log("findone", result);
//     if (result) {
//       console.log("username exist");
//       console.log(req.body.password);
//       var password = bcrypt.compareSync(req.body.password, result.password)
//       if (password) {
//         console.log("password exists");
//         //res.send({state:false,content:res.sendFile(path.join(__dirname, "../client/views/home.html"))});
//         //res.json({html:html.toString(),state:false})
//         res.sendFile(path.join(__dirname, "../client/views/home.html"));
//         // res.re

//       } else {
//         next({status : 404,message :"username or password not found"})
//        // res.send({state: true});
//         //console.log("password not exist");
//       }
//     } else {
//       next({status : 404,message :"username or password not found"})
//       //res.send({state: true});
//     }
//   });
// })

app.post("/forgotpassword",(req,res)=>{
  res.sendFile(path.join(__dirname, "../client/views/forgot-password.html"))
})

// app.use('/',require('./routes/api/user/main'));
// app.use("/home",require('./routes/api/user/home'));
// app.use('/forgotpassword',require('./routes/api/user/forgotpassword'))


app.post("/signup", (req, res) => {
  var transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'beanforkaccess@gmail.com',
      pass: 'Admin@123'
    }
  });

  // console.log(' Email is sent to', req.body.email);
  // console.log(req.body.code)
  // if (req.body.email) {
  //   res.send({ status: true });
  // }
  // else
  //   res.send({ status: false });

  
  transporter.sendMail({
    from: 'beanforkaccess@gmail.com',
    to: req.body.email,
    subject: 'Forgot Password',
    text: 'Verification code is ' + req.body.code

  }, function (err) {
    if (err)
      console.log(err);
  });
          var User = new userprofile(req.body);
          User.password=bcrypt.hashSync(User.password,bcrypt.genSaltSync(8));
          User.save();
          userprofile.findOne({email:req.body.email},function(err,result){
            if(result){
              
              res.send({id:result.id})
            }
          })
});





app.post("/user",(req,res)=>{
  //console.log(req.body);
    userprofile.findOne({username: req.body.username},function(err,result){
      //console.log(result);
      if(result){
        //console.log("exists")
        res.send({status : true})
      }
      else{
        //console.log("not exist")
      res.send({status: false})}
    })
})

app.post("/email",(req,res)=>{
  console.log(req.body);
    userprofile.findOne({email: req.body.email},function(err,result){
      //console.log(result);
      if(result){
        //console.log("exists")
        res.send({status : true})
      }
      else{
       //console.log("not exist")
      res.send({status: false})}
    })
})

app.post("/code",(req,res,next)=>{
  userprofile.findOne({_id :req.body.id},function(err,result){
    console.log("this is code result",result);
    console.log(req.body.code)
    if(result){
      if(result.code === req.body.code){
        res.sendFile(path.join(__dirname, "../client/views/home.html"))
      }
      else{
        next({status : 404,message :"Verification code is incorrect"})
      }
    }
    else{
      next({status : 404,message :"Verification code is incorrect"})
    }
  })
})


app.post("/newdiscussion",(req,res,next)=>{
  res.sendFile(path.join(__dirname, "../client/views/new-discussion.html"))
})

app.post("/creatediscussion",(req,res,next)=>{
  
  userprofile.findOne({_id: req.body.id},function(err,result){
    var postobject = {topic: req.body.topic , description: req.body.description}
    result.post.push(postobject);
    console.log("final result",result);
    result.save()
  })
})

app.use((error,req,res,next)=>{
  console.log(error);
  res.sendStatus(error.status || 500);
});
app.listen(port, () => {
  console.log("Server listenening to port" + port);
});
