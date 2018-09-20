// @global
var testing = false;
var testFile = "pi.json";

//Used packages
var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    passportLocal   = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

// Used models

var User            = require("./models/user.js");
// Routes
var cardRoutes      = require("./routes/cards.js");
var categoryRoutes  = require("./routes/categories.js");
var indexRoutes     = require("./routes/index.js");
var playRoutes      = require("./routes/play.js");

mongoose.connect("mongodb://localhost/memory_app");

// Miscellaneous setup
app.use(methodOverride('_method'));

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine", "ejs");


// Setup for the passport authentification part of the app
app.use(require("express-session")({
  secret: "Decode the information",
  resave: false,
  saveUninitialized:false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new passportLocal(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Using the routes defined in the routes folder
app.use("/",indexRoutes);
app.use("/categories", categoryRoutes);
app.use("/", playRoutes);
app.use("/categories/:id/cards", cardRoutes);

if (testing){

  var seed = require("./misc/seed.js");
  // var test = require("./test.js");
  // seed.extractDataIntoJSON("testAccount", testFile);
  seed.eraseData("testAccount");
  // seed.seed("testAccount", testFile);
  // test.runTests();
  // require("./test.js")();

}


app.listen(5786, function(){
  console.log("The server is a lie! \n" +
              "But if it wasn't, it'd be found on port 5786");
});
