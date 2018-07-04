var express = require("express"),
    router  = express.Router(),
    User = require("../models/user.js"),
    Client = require("../models/client.js"),
    passport = require("passport");





//This will eventually be a landing page
router.get("/", function(req,res){
  res.redirect("/login");
});

/* The login page */
router.get("/login", function(req,res) {
  res.render("account_login");
});


router.post("/login", passport.authenticate("local", {
  successRedirect: "/categories",
  failureRedirect: "/login"
}) , function(req,res) {

});
// Account creation page
router.get("/register", function(req,res){
  res.render("register");
});

// Returns form that for the create account page
router.post("/register", function(req,res){
  //there needs to be context for the user here
  User.register(new User({username: req.body.username}), req.body.password, function(err, user){
    if(err){
      console.log(err);
      return res.render("register");
    }
    else {
      // Create the associated client
      Client.create({
        user:user._id,
        categories:[]
      });
      // Should redirect to login since the user is not yet logged in
      res.redirect("/login");
    }

  })
  //How does the redirect method work
});


router.get("/logout", function(req,res){
  req.logout();
  res.redirect("/login");
});

module.exports = router;
