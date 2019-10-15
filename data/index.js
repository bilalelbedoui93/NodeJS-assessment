  
const mongoose = require("mongoose");

const model = mongoose.model.bind(mongoose);

const { user } = require('./schemas')

module.exports = {
  User: model("users", user),
};



