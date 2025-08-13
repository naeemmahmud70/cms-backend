const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (draftCollections) => {
  // Create a new draft
  router.post("/drafts", async (req, res) => {
    try {
      const newDraft = req.body;
      const result = await draftCollections.insertOne(newDraft);

      res.status(201).json({
        message: "Draft has been created successfully!",
        draftId: result.insertedId,
      });
    } catch (error) {
      console.error("Error creating draft:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all drafts
  router.get("/drafts", async (req, res) => {
    try {
      const drafts = await draftCollections.find().toArray();

      res.status(200).json({
        message: "Drafts fetched successfully!",
        drafts,
      });
    } catch (error) {
      console.error("Error fetching drafts:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get single draft by title
  router.get("/drafts/:title", async (req, res) => {
    try {
      const decodedTitle = decodeURIComponent(req.params.title);
      const draft = await draftCollections.findOne({ articleTitle: decodedTitle });

      if (!draft) {
        return res.status(404).json({ message: "Draft not found" });
      }

      res.status(200).json({
        message: "Draft fetched successfully!",
        draft,
      });
    } catch (error) {
      console.error("Error fetching draft:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Update draft
  router.patch("/drafts/:id", async (req, res) => {
    try {
      const { updatedDraft } = req.body;

      const result = await draftCollections.updateOne(
        { _id: ObjectId(req.params.id) },
        {
          $set: {
            coverImg: updatedDraft.coverImg,
            articleTitle: updatedDraft.articleTitle,
            tag: updatedDraft.tag,
            articleContent: updatedDraft.articleContent,
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Draft not found" });
      }

      res.status(200).json({
        message: "Draft updated successfully!",
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Error updating draft:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete draft
  router.delete("/drafts/:id", async (req, res) => {
    try {
      const result = await draftCollections.deleteOne({
        _id: ObjectId(req.params.id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Draft not found" });
      }

      res.status(200).json({
        message: "Draft deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting draft:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};
