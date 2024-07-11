const router = require("express").Router();
const { Post, User } = require("../models");
const sequelize = require("../config/connection");

router.get("/", async (req, res) => {
  try {
    const dbPostData = await Post.findAll({
      attibutes: ["id", "title", "content", "created_on"],
      include: [
        {
          model: Comment,
          attributes: [
            "id",
            "comment_text",
            "post_id",
            "user_id",
            "created_on",
          ],
          include: [
            {
              model: User,
              attributes: ["username"],
            },
          ],
        },
        {
          model: User,
          attributes: ["username"],
        },
      ],
    });

    const posts = dbPostData.map((post) => post.get({ plain: true }));
    console.log(posts);

    res.render("homepage", {
      posts,
      loggedIn: req.session.loggedIn,
      username: req.session.username,
      user_id: req.session.user_id,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});
