const express = require("express");
const router = express.Router();
const { ensureAuth } = require("../middleware/auth");
const Story = require("../models/story");
require("./ajax/stories"); // importing stories mapping for ajax usage

//@GEt  Stories/add
router.get("/add", ensureAuth, (req, res) => {
  res.render("stories/add");
});

//@post stories/
//to add story
router.post("/", ensureAuth, async (req, res) => {
  try {
    req.body.user = req.user.id; //so body forms like schema
    await Story.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    res.render("error/500.hbs");
  }
});

//@GEt SHow all stories
router.get("/", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({ status: "public" })
      .populate("user")
      .sort({ createdAt: "desc" })
      .lean();
    console.log("Stories" + stories);
    res.render("stories/index", { stories });
  } catch (error) {
    console.log(error);
    res.render("error/500");
  }
});

// @desc    Show single story
// @route   GET /stories/:id
router.get("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).populate("user").lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user._id != req.user.id && story.status == "private") {
      res.render("error/404");
    } else {
      res.render("stories/show", {
        story,
      });
    }
  } catch (err) {
    console.error(err);
    res.render("error/404");
  }
});

//@GEt  Stories/edit/:id
router.get("/edit/:id", ensureAuth, async (req, res) => {
  const story = await Story.findOne({ _id: req.params.id }).lean();
  console.log(story);
  if (!story) {
    res.render("error/404");
  }

  if (story.user != req.user.id) {
    res.redirect("/stories");
  } else {
    res.render("stories/edit", {
      story,
    });
  }
});

// @desc    Update story
// @route   PUT /stories/:id
router.put("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      story = await Story.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
        runValidators: true,
      });

      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    Delete story
// @route   DELETE /stories/:id
router.delete("/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findById(req.params.id).lean();

    if (!story) {
      return res.render("error/404");
    }

    if (story.user != req.user.id) {
      res.redirect("/stories");
    } else {
      await Story.remove({ _id: req.params.id });
      res.redirect("/dashboard");
    }
  } catch (err) {
    console.error(err);
    return res.render("error/500");
  }
});

// @desc    User stories
// @route   GET /stories/user/:userId
router.get("/user/:userId", ensureAuth, async (req, res) => {
  try {
    const stories = await Story.find({
      user: req.params.userId,
      status: "public",
    })
      .populate("user")
      .lean();

    res.render("stories/index", {
      stories,
    });
  } catch (err) {
    console.error(err);
    res.render("error/500");
  }
});

//@GEt  Stories/like/:id
router.get("/like/:id", ensureAuth, async (req, res) => {
  try {
    let story = await Story.findOne({ _id: req.params.id }).lean();
    // to not let not the same user like the story twice
    console.log("User id " + req.user.id);
    let likedBy = story.likedBy

    for (let i = 0; i < likedBy.length; i++) {
      if (String(likedBy[i]._id) === String(req.user.id)) {
        console.log("inga vantha");
        res.end(JSON.stringify({ status: 404, likes: story.likes }))
        return
      }
    }

    if (!story.likes) story.likes = 0;

    const likes = story.likes + 1;

    await Story.findOneAndUpdate(
      { _id: req.params.id },
      {
        likes: likes,
        $push: { likedBy: req.user.id }
      }
    );
    console.log("ingayu vantha");
    res.end(JSON.stringify({ likes: likes }))
  } catch (error) {
    console.error(error);
  }


});

module.exports = router;
