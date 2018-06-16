var mongoose = require("mongoose"),
  passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
  username:String,
  password:String,
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Category"
    }]
});

UserSchema.plugin(passportLocalMongoose);

var User = mongoose.model("User", UserSchema);

module.exports= User;
