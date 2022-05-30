const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// routes
const posts = require("./routes/api/posts");
const user = require("./routes/api/profile");

const app = express();

// body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

// database config
const db =
  "mongodb+srv://sbkxp:123frytki@gamesdata.7vpr3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
// database connection
mongoose
  .connect(db)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));
// passport middleware
app.use(passport.initialize());

// passport config
require("./config/passport")(passport);

// use routes
app.use("/api/posts", posts);
app.use("/api/profile", user);

// Access controll
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
