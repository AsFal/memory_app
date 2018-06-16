var mongoose = require("mongoose");
// var cardSchema = require("./card.js");

var categorySchema = new mongoose.Schema({
  title:String,
  description:String,
  image:String,
  nb_cards: Number,
  cards:[
  {
    type: mongoose.Schema.Types.ObjectId,
    ref : "Card"
  }]
})

var Category = mongoose.model("Category", categorySchema);

module.exports = Category;
