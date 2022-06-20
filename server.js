const express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const router = require("./routes/book-routes");
const app = express();
dotenv.config();

// Middleware
app.use(bodyParser.json());
app.use(cors());
app.use("/books", router);
//Static files folder in our routes
app.use("/uploads", express.static("uploads"));
if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.DB)
  .then(() => console.log("Connected To Database"))
  .then(() =>
    app.listen(port, () => console.log(`Server is Running on Port ${port}`))
  )
  .catch((error) => console.log(error));
