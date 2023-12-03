var express = require('express');
var router = express.Router();
const a = require("../model/exModel");
const b=require("../model/expense");
const passport = require("passport");
const nodemailer=require('nodemailer')
const LocalStrategy = require("passport-local");
passport.use(new LocalStrategy(a.authenticate()));
const fs=require('fs');
var up=require('../utils/multer').single('avatar');




// Read the image file

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index', { admin:req.user});
});

router.get('/signup', function(req, res, next) {

  res.render('signup', { admin:req.user});
});

router.post('/signup', async function(req, res, next){
  up(req, res, async function (err) {
    if(err) throw err;
try {
  var d=await a.register({username:req.body.username,email:req.body.email,age:req.body.age,
  no:req.body.no,name:req.body.name,profession:req.profession,avatar:req.file.filename,},req.body.password)
   d.save();
  res.redirect('/login')
} catch (error) {
  res.send(error);
}

});
});

router.get('/login', function(req, res, next) {

  res.render('login', { admin:req.user});
});


router.post(
  "/login",
  passport.authenticate("local", {
      successRedirect: "/profile",
      failureRedirect: "/login",
  }),
  function (req, res, next) {}
);


router.get('/profile',isLoggedIn, function(req, res, next) {

  res.render('profile', { admin:req.user});
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
      next();
  } else {
      res.redirect("/login");
  }
}

router.get("/signout", isLoggedIn, function (req, res, next) {
  req.logout(() => {
      res.redirect("/login");
  });
});

router.get('/expense',isLoggedIn, function(req, res, next) {

  res.render('expense', { admin:req.user});
});

router.get('/add',isLoggedIn, function(req, res, next) {

  res.render('add', { admin:req.user});
});

router.post('/add',isLoggedIn, async function(req, res, next) {
 try {
      


 } catch (error) {
  
 }
});


router.get('/forget', function(req, res, next) {

  res.render('forget', { admin:req.user});
});

router.post("/send-mail", async function (req, res, next) {
  try {
      const p = await a.findOne({ email: req.body.email });
      if (!p) return res.send("User not found");

      sendmailhandler(req, res, p);
  } catch (error) {
      console.log(error);
      res.send(error);
  }
});

// -------------------------------------
//code to send otp
function sendmailhandler(req, res, user) {
  const otp = Math.floor(1000 + Math.random() * 9000);
  // admin mail address, which is going to be the sender
  const transport = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 465,
      auth: {
          user: "mishrasanskar098@gmail.com",
          pass: "ekomfombxazcxbwn",
      },
  });
  // receiver mailing info
  const mailOptions = {
      from: "Dhanesh Pvt. Ltd.<dhanesh1296@gmail.com>",
      to: user.email,
      subject: "Testing Mail Service",
      // text: req.body.message,
      html: `<h1>${otp}</h1>`,
  };
  // actual object which intregrate all info and send mail
  transport.sendMail(mailOptions, (err, info) => {
      if (err) return res.send(err);
      console.log(info);
      user.resetPasswordOtp = otp;
      user.save();
      res.render("otp", { admin: req.user, email: user.email });
  });
}

router.post("/match-otp/:email", async function (req, res, next) {
  try {
      const user = await a.findOne({ email: req.params.email });
      if (user.resetPasswordOtp == req.body.otp) {
          user.resetPasswordOtp = -1;
          await user.save();
          res.render("resetpassword", { admin: req.user, id: user._id });
      } else {
          res.send(
              "Invalid OTP, Try Again <a href='/forget'>Forget Password</a>"
          );
      }
  } catch (error) {
      res.send(error);
  }
});

router.post("/resetpassword/:id", async function (req, res, next) {
  try {
      const user = await User.findById(req.params.id);
      await user.setPassword(req.body.password);
      res.redirect("/signin");
  } catch (error) {
      res.send(error);
  }
});

router.post("/add", isLoggedIn, async function (req, res, next) {
  try {
      const expense = new Expense(req.body);
      req.user.expenses.push(expense._id);
      expense.user = req.user._id;
      await b.save();
      await req.user.save();
      res.redirect("/profile");
  } catch (error) {
      res.send(error);
  }
});
module.exports = router;
