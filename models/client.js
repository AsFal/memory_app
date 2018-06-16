var mongoose = require("mongoose");

var clientSchema = mongoose.Schema({
  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref : "User"
  },
  categories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref : "Category"
    }]
});

var Client = mongoose.model("Client", clientSchema);

module.exports = Client;
