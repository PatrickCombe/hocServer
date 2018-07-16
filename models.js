var mongoose = require('mongoose');

var userSchema = mongoose.Schema({
  username: {
    type: String,
  required: true},
  password: {
    type: String,
  required: true},
});

var documentSchema = mongoose.Schema({
  owner: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  authors: [{type: mongoose.Schema.ObjectId,
    ref:'User'
  }],
  created: Date,
  content: String,
  password: String,

});



User = mongoose.model('User', userSchema);


module.exports = {
  User: User ,
  Document: mongoose.model('Document', documentSchema)
};
