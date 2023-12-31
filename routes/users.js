const router = require("express").Router();
const User = require("../models/User.js");
const Post = require("../models/Post.js");
const bcrypt = require("bcrypt");

//UPDATE
// router.put("/:id", async (req, res) => { 
//   if (req.body.userId === req.params.id) { 
//     if (req.body.password) {
//       const salt = await bcrypt.genSalt(10);
//       req.body.password = await bcrypt.hash(req.body.password, salt);
//     } 
//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         req.params.id,
//         {
//           // $set: req.body,
//         },
//         { new: true }
//       );
//       res.status(200).json(updatedUser);
//     } catch (err) {
//       res.status(500).json(err);
//       console.log(err)
//     }
//   } else {
//     res.status(401).json("You can update only your account!");
//   }
// });

router.put("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    const updateFields = {};

    if (req.body.username) {
      updateFields.username = req.body.username;
    }

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(req.body.password, salt);
    }

    if (req.body.profilePic) {
      updateFields.profilepic = req.body.profilepic;
    }

    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        updateFields,
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
      console.log(err);
    }
  } else {
    res.status(401).json("You can update only your account!");
  }
});


// router.put("/:id", async (req, res) => {
//   if(req.body.userId)
//   try{
// } catch (err) {
//   res.status(500).json(err);
// }
// });


///DELETE
router.delete("/:id", async (req, res) => {
  if (req.body.userId === req.params.id) {
    try {
      const user = await User.findById(req.params.id);
      try {
        await Post.deleteMany({ username: user.username });
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json("User has been deleted...");
      } catch (err) {
        res.status(500).json(err);
      }
    } catch (err) {
      res.status(404).json("User not found!");
    }
  } else {
    res.status(401).json("You can delete only your account!");
  }
});

//GET USER
router.get("/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;