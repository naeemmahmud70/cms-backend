const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongodb");

module.exports = (usersCollection) => {
  // admins list with pagination
  router.get("/admins", async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const skip = (page - 1) * limit;

      const totalAdmins = await usersCollection.countDocuments();

      const admins = await usersCollection
        .find()
        .skip(skip)
        .limit(limit)
        .toArray();

      res.status(200).json({
        message: "Admins fetched successfully!",
        admins,
        pagination: {
          total: totalAdmins,
          page,
          limit,
          totalPages: Math.ceil(totalAdmins / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching admins:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  router.patch("/admins", async (req, res) => {
    try {
      const { userId, isBlocked } = req.body;
      const result = await usersCollection.updateOne(
        { _id: ObjectId(userId) },
        {
          $set: {
            role: isBlocked === true ? "blocked" : "admin",
          },
        }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({
          message: "Admin not found.",
        });
      }

      res.status(200).json({
        message: "Admin role updated successfully!",
        modifiedCount: result.modifiedCount,
      });
    } catch (error) {
      console.error("Error updating article:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  });

  return router;
};
