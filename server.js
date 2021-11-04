const express = require("express");
const mongoose = require("mongoose");

// routes
const posts = require("./routes/api/posts");
const add = require("./routes/api/add");

const app = express();

// database config
const db =
  "mongodb+srv://sbkxp:123frytki@gamesdata.7vpr3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// database connection
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

app.get("/", (req, res) => res.send("Hello World!"));

// use routes
app.use("/api/posts", posts);
app.use("/api/add", add);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
