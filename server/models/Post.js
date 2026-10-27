const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is Required']
  },
  content: {
    type: String,
    required: [true, 'Content is Required']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  comments: [
    {
      content: {
        type: String
      },
      author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      createdOn: {
        type: Date,
        default: Date.now
      }
    }
  ],
  createdOn: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Post", postSchema);
