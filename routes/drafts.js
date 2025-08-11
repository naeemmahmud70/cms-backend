const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (draftCollections) => {
  // Add draft
  router.post("/addDraft", async (req, res) => {
    try {
      const newDraft = req.body;
      const result = await draftCollections.insertOne(newDraft);
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to add draft", error });
    }
  });

  // Get all drafts
  router.get("/getDrafts", async (req, res) => {
    try {
      const drafts = await draftCollections.find().toArray();
      res.send(drafts);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch drafts", error });
    }
  });

  // Get single draft by title
  router.get("/draft/:title", async (req, res) => {
    try {
      const decodedTitle = decodeURIComponent(req.params.title);
      const draft = await draftCollections.findOne({ blogTitle: decodedTitle });
      res.send(draft || {});
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch draft", error });
    }
  });

  // Update draft
  router.patch("/updateDraftBlog/:id", async (req, res) => {
    try {
      const newDraftData = req.body.updatedDraft;
      const result = await draftCollections.updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            coverImg: newDraftData.coverImg,
            blogTitle: newDraftData.blogTitle,
            tag: newDraftData.tag,
            blogContent: newDraftData.blogContent,
          },
        }
      );
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to update draft", error });
    }
  });

  // Delete draft
  router.delete("/delete/draft/:id", async (req, res) => {
    try {
      const result = await draftCollections.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to delete draft", error });
    }
  });

  return router;
};
