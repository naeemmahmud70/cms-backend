const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (articlesCollections) => {
  
  router.post("/articles", async (req, res) => {
    try {
      const newArticles = req.body;
      const result = await articlesCollections.insertOne(newArticles);

      res.status(201).json({
        message: "Article has been created successfully.",
        articleId: result.insertedId,
      });
    } catch (error) {
      console.error("Error creating article:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/articles", async (req, res) => {
    try {
      const articles = await articlesCollections.find().toArray();

      res.status(200).json({
        message: "Articles retrieved successfully.",
        total: articles.length,
        articles: articles,
      });
    } catch (error) {
      console.error("Error retrieving articles:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.get("/articles/:title", async (req, res) => {
    try {
      const decodedTitle = decodeURIComponent(req.params.title);
      const article = await articlesCollections.findOne({
        articleTitle: decodedTitle,
      });

      if (!article) {
        return res.status(404).json({
          message: "Article not found.",
        });
      }

      res.status(200).json({
        message: "Article retrieved successfully.",
        article,
      });
    } catch (error) {
      console.error("Error retrieving article:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.patch("/articles/:id", async (req, res) => {
    try {
      const { updatedArticle } = req.body;

      const result = await articlesCollections.updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            coverImg: updatedArticle.coverImg,
            articleTitle: updatedArticle.articleTitle,
            tag: updatedArticle.tag,
            articleContent: updatedArticle.articleContent,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: "Article not found.",
        });
      }

      res.status(200).json({
        message: "Article updated successfully!",
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.delete("/articles/:id", async (req, res) => {
    try {
      const result = await articlesCollections.deleteOne({
        _id: ObjectId(req.params.id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({
          message: "Article not found.",
        });
      }

      res.status(200).json({
        message: "Article deleted successfully.",
        deletedCount: result.deletedCount,
      });
    } catch (error) {
      console.error("Error deleting article:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};
