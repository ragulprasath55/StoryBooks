const mongoose = require("mongoose");

const StorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  likes: {
    type: Number,
    required: false,
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false,
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Story", StorySchema);
