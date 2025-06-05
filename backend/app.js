const express = require("express");
const app = express();
const cors = require("cors");
const chapterRoutes = require("./routes/chapterRoutes");

require("dotenv").config();

app.use(express.json());

app.use(
  cors({
    origin: "http://localhost:3000", // allow requests from your frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

app.use("/api/v1/chapters", chapterRoutes);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
