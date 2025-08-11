const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");


module.exports = (blogsCollections) => {
  router.post("/allBlogs", async (req, res) => {
    const newBlog = req.body;
    const result = await blogsCollections.insertOne(newBlog);
    res.send(result);
  });

  router.get("/getAllBlogs", async (req, res) => {
    const blogs = await blogsCollections.find().toArray();
    res.send(blogs);
  });

  router.get("/blog/:title", async (req, res) => {
    const decodedTitle = decodeURIComponent(req.params.title);
    const blog = await blogsCollections.findOne({ blogTitle: decodedTitle });
    res.send(blog || {});
  });

  router.get("/blog/edit/:id", async (req, res) => {
    const blog = await blogsCollections.findOne({
      _id: ObjectId(req.params.id),
    });
    res.send(blog);
  });

  router.patch("/updateBlog/:id", async (req, res) => {
    const newBlogData = req.body.updatedBlog;
    const result = await blogsCollections.updateOne(
      { _id: ObjectId(req.params.id) },
      {
        $set: {
          coverImg: newBlogData.coverImg,
          blogTitle: newBlogData.blogTitle,
          tag: newBlogData.tag,
          blogContent: newBlogData.blogContent,
        },
      }
    );
    res.send(result);
  });

  router.delete("/blog/delete/:id", async (req, res) => {
    const result = await blogsCollections.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  return router;
};
