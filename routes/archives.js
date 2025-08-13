const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (archivesCollections) => {
  // Create a new archive
  router.post("/archives", async (req, res) => {
    try {
      const newArchive = req.body;
      const result = await archivesCollections.insertOne(newArchive);

      res.status(201).json({
        message: "Articles archived successfully!",
        archiveId: result.insertedId,
      });
    } catch (error) {
      console.error("Error creating archive:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get all archives
  router.get("/archives", async (req, res) => {
    try {
      const archives = await archivesCollections.find().toArray();
      res.status(200).json({
        message: "Archives fetched successfully!",
        archives,
      });
    } catch (error) {
      console.error("Error fetching archives:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Delete archive
  router.delete("/archives/:id", async (req, res) => {
    try {
      const result = await archivesCollections.deleteOne({
        _id: ObjectId(req.params.id),
      });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: "Archive not found!" });
      }

      res.status(200).json({
        message: "Archive deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting archive:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  return router;
};
