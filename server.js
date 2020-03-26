require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const PORT = process.env.PORT;
const expressLayouts = require("express-ejs-layouts");
const authRoutes = require("./routes/auth.route"); //

const session = require("express-session");
const flash = require("connect-flash"); // displays on time msgs
let passport = require("./config/passportConfig");




const server = express();


mongoose.connect(
  process.env.MONGODB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  () => {
    console.log("mongdb connected!");
  },
  err => {
    console.log(err);
  }
);

mongoose.set("debug", true);
server.use(express.static("public"));
server.use(express.urlencoded({ extended: true }));
server.set("view engine", "ejs");
server.use(expressLayouts);

/*-- These must be place in the correct place */
server.use(
  session({
    secret: process.env.SECRET,
    saveUninitialized: true,
    resave: false,
    cookie: { maxAge: 360000 }
  })
);
//-- passport initialization
server.use(passport.initialize());
server.use(passport.session());
server.use(flash());

server.use(function(request, response, next) {
  // before every route, attach the flash messages and current user to res.locals
  response.locals.alerts = request.flash();
  response.locals.currentUser = request.user;
  next();
});

server.use(authRoutes);

server.get("*", (request, response) => {
  response.send("doesnt exist yet!");
});

server.listen(process.env.PORT, () =>
  console.log(`connected to express on ${PORT}`)
);
