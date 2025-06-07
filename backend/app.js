const express = require("express");
const app = express();
const cors = require("cors");
const chapterRoutes = require("./routes/chapterRoutes");

require("dotenv").config();

app.use(express.json());

app.use(
  cors({
    origin: "https://mgo-chapdashbe-1.onrender.com", // allow requests from your frontend
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type", "x-api-key"],
  })
);

app.use("/api/v1/chapters", chapterRoutes);

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the Chapters API!",
    info: "This backend is deployed on Render.",
    usage: "Use the endpoint below to access chapter data.",
    endpoint: "https://mgo-chapdashbe.onrender.com/api/v1/chapters/",
  });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

module.exports = app;
