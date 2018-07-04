var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    methodOverride  = require("method-override"),
    passport        = require("passport"),
    passportLocal   = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose");

var Card            = require("./models/card.js"),
    Category        = require("./models/category.js"),
    User            = require("./models/user.js");

var cardRoutes      = require("./routes/cards.js");
var categoryRoutes  = require("./routes/categories.js");
var indexRoutes     = require("./routes/index.js");

var seed = require("./seed.js");

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
app.use("/categories/:id/cards", cardRoutes);


// seed.seed_AsFal();

app.listen(3000, function(){
  console.log("The server is a lie!");
});
