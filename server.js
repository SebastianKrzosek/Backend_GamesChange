const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// routes
const posts = require("./routes/api/posts");
const user = require("./routes/api/profile");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};

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
app.use(cors(corsOptions));
// passport config
require("./config/passport")(passport);

// use routes
app.use("/api/posts", posts);
app.use("/api/profile", user);

const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server running on ${port}`);
});
