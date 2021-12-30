const express = require("express");
const Story = require("../../models/story");
const router = express.Router();
const { ensureAuth } = require("../../middleware/auth"); //two go  two folders up

//@GEt  Stories/like/:id
router.get("/like/:id", ensureAuth, async (req, res) => {
  try {
    let story = Story.findOne({ _id: req.params.id }).lean();
    Story.findOneAndUpdate({ _id: req.params.id }, { likes: story.likes + 1 });
  } catch (error) {
    console.error(error);
  }
});
