const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();
const { MongoClient } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(helmet());

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function run() {
  try {
    await client.connect();
    console.log("Database connected successfully");
    //database collections
    const db = client.db("brainaliveOfficial");
    const blogsCollections = db.collection("blogsCollections");
    const draftsCollections = db.collection("draftsCollections");
    const archivesCollections = db.collection("archiveCollections");
    const messageCollection = db.collection("contactMessages");

    // Importing routes and passing the collections
    const blogsRoutes = require("./routes/blogs")(blogsCollections);
    const draftsRoutes = require("./routes/drafts")(draftsCollections);

    app.use("/api", blogsRoutes);
    app.use("/api", draftsRoutes);
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
}

run();

process.on("SIGINT", async () => {
  await client.close();
  console.log("Database connection closed");
  process.exit(0);
});

app.get("/", (req, res) => {
  res.send("Server Running");
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
