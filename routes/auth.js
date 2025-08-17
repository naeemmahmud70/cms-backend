const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

module.exports = (usersCollection) => {
  // SIGNUP
  router.post("/signup", async (req, res) => {
    try {
      const { name, email, password, role, createdAt } = req.body;

      const existingUser = await usersCollection.findOne({ email });
      if (existingUser) {
        return res.status(400).send({ message: "User already exists!" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const result = await usersCollection.insertOne({
        name,
        email,
        password: hashedPassword,
        role,
        createdAt,
      });

      const token = jwt.sign(
        { id: result.insertedId, email, role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(201).send({
        message: "Signed up successfully!",
        token,
        user: {
          id: result.insertedId,
          name,
          email,
          role,
          createdAt,
        },
      });
    } catch (error) {
      res.status(500).send({ message: "Signup failed", error });
    }
  });

  // LOGIN
  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await usersCollection.findOne({ email });
      if (!user) {
        return res.status(400).send({ message: "Email not found!" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).send({ message: "Incorrect password!" });
      }

      const token = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );

      res.status(200).send({
        message: "Login successful!",
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          createdAt: user.createdAt,
        },
      });
    } catch (error) {
      res.status(500).send({ message: "Login failed!", error });
    }
  });

  return router;
};
