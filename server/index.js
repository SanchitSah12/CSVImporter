const express = require("express");
const multer = require("multer");
const csv = require("csv-parser");
const fs = require("fs").promises;
const path = require("path");
const process = require("process");
require("dotenv").config();
const cors = require("cors");

const app = express();
const port = 3000;
app.use(express.json());
// Set up multer storage engine
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
app.use(cors());
// Handle POST request to /upload

const auth = require("./authToken");
const { listMajors, authorize } = require("./hello");

app.post("/upload", upload.single("file"), (req, res) => {
  const csvFile = req.file;
  if (!csvFile) {
    return res.status(400).send("No CSV file uploaded");
  }

  // Parse the CSV file and extract the column names
  const columnNames = [];
  csvFile.buffer
    .toString()
    .split("\n")[0]
    .split(",")
    .forEach((columnName) => {
      columnNames.push(columnName.trim());
    });

  // Send the column names in the response
  res.send(columnNames);
});

app.post("/spreadsheet", upload.single("data"), async (req, res) => {
  const csvFile = req.file;
  var column = req.body.columns;
  const sheetName = req.body.sheetName;
  const columnNames = column.split(",").map((columnName) => columnName.trim());

  if (!csvFile) {
    return res.status(400).send("No CSV file uploaded");
  }
  authentication
    .authenticated()
    .then(async (auth) => {
      // res.send(columnNames)
      res.send(await listMajors(auth, csvFile, columnNames,sheetName));
    })
    .catch((err) => {
      res.status(401).json(`you know wetin happen, ${err}`);
    });
});

const authentication = require("./Authentication");

// app.get("/hello", (req, res) => {

// });

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
