const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (archivesCollections) => {
  // Add archive
  router.post("/addArchive", async (req, res) => {
    try {
      const newArchive = req.body;
      const result = await archivesCollections.insertOne(newArchive);
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to add archive", error });
    }
  });

  // Get all archives
  router.get("/getAllArchive", async (req, res) => {
    try {
      const archives = await archivesCollections.find().toArray();
      res.send(archives);
    } catch (error) {
      res.status(500).send({ message: "Failed to fetch archives", error });
    }
  });

  // Delete archive
  router.delete("/archive/delete/:id", async (req, res) => {
    try {
      const result = await archivesCollections.deleteOne({
        _id: ObjectId(req.params.id),
      });
      res.send(result);
    } catch (error) {
      res.status(500).send({ message: "Failed to delete archive", error });
    }
  });

  return router;
};
