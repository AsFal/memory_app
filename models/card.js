var mongoose =  require("mongoose");

var cardSchema = new mongoose.Schema({
  question:String,
  answer:String,
  timeStamp:Number,
  consecutiveRightAnswers:Number

});

var Card = mongoose.model("Card", cardSchema)

module.exports = Card;
