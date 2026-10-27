const Post = require("../models/Post");
const { successResponse, errorHandler } = require("../auth");

// Add Post
module.exports.addPost = (req, res) => {
  const newPost = new Post({
    title: req.body.title,
    content: req.body.content,
    author: req.user.id
  });

  return newPost.save()
    .then(post => {
      return successResponse(
        res,
        201,
        "Post created successfully",
        post
      );
    })
    .catch(error => errorHandler(error, req, res));
};

// Get All Posts
module.exports.getAllPosts = (req, res) => {
  return Post.find({})
    .populate("author", "username")
    .then(posts => {
      return successResponse(
        res,
        200,
        "Posts retrieved successfully",
        posts
      );
    })
    .catch(error => errorHandler(error, req, res));
};

// Get One Post
module.exports.getPost = (req, res) => {
  return Post.findById(req.params.id)
    .populate("author", "username")
    .populate("comments.author", "username")
    .then(post => {
      if (!post) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      return successResponse(
        res,
        200,
        "Post retrieved successfully",
        post
      );
    })
    .catch(error => errorHandler(error, req, res));
};

// Edit Post
module.exports.updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)

    if (!post) {
      return res.status(404).json({
        message: 'Post not found'
      })
    }

    // Get the logged-in user's ID
    const userId = req.user.id

    // Check if the logged-in user owns this post
    if (post.author.toString() !== userId.toString()) {
      return res.status(403).json({
        message: 'You are not allowed to edit this post'
      })
    }

    // Update only if the user owns the post
    post.title = req.body.title
    post.content = req.body.content

    const updatedPost = await post.save()

    return res.status(200).json({
      message: 'Post updated successfully',
      data: updatedPost
    })

  } catch (error) {
    return res.status(500).json({
      message: 'Error updating post',
      error: error.message
    })
  }
}

// Delete Post
module.exports.deletePost = (req, res) => {
  return Post.findById(req.params.id)
    .then(post => {
      if (!post) {
        return res.status(404).json({
          message: "Post not found"
        });
      }

      const isAuthor = post.author.toString() === req.user.id;
      const isAdmin = req.user.isAdmin === true;

      if (!isAuthor && !isAdmin) {
        return res.status(403).json({
          message: "You are not allowed to delete this post"
        });
      }

      return Post.findByIdAndDelete(req.params.id)
        .then(deletedPost => {
          return successResponse(
            res,
            200,
            "Post deleted successfully",
            deletedPost
          );
        });
    })
    .catch(error => errorHandler(error, req, res));
};

// Add Comment
module.exports.addComment = async (req, res) => {

  // Add these two lines here
  console.log("Add comment route reached");
  console.log("Comment data:", req.body);

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        message: "Post not found."
      });
    }

    if (
      typeof req.body.content !== "string" ||
      !req.body.content.trim()
    ) {
      return res.status(400).json({
        message: "Comment cannot be empty."
      });
    }

    post.comments.push({
      content: req.body.content.trim(),
      author: req.user.id
    });

    const updatedPost = await post.save();

    return successResponse(
      res,
      201,
      "Comment added successfully",
      updatedPost
    );

  } catch (error) {
    return errorHandler(error, req, res);
  }
};

