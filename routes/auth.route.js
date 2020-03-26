const router = require("express").Router();
const User = require("../models/user.model");

const passport = require("../config/passportConfig");
const isLoggedIn = require("../config/loginBlocker");
const { check, validationResult } = require("express-validator");


router.get("/auth/signup", (request, response) => {
  response.render("auth/signup");
});

router.post(
  "/auth/signup",
  // [
  //   check("firstname").isLength({ min: 2 }),
  //   check("lastname").isLength({ min: 2 }),
  //   // username must be an email
  //   check("email").isEmail(),
  //   // password must be at least 5 chars long
  //   check("password").isLength({ min: 5 })
  // ],
  (request, response) => {
    const errors = validationResult(request);
    console.log(errors);
    if (!errors.isEmpty()) {
      request.flash("autherror", errors.errors);
      return response.redirect("/auth/signup");
    }

    let user = new User(request.body);
    user
      .save()
      .then(() => {
        //()()()()
        // response.redirect("/home");
        //user login after registration
        passport.authenticate("local", {
          successRedirect: "/home",
          successFlash: "Account created and You have logged In!"
        })(request, response);
      })
      .catch(err => {
        // console.log(err);
        if (err.code == 11000) {
          console.log("Email Exists");
          request.flash("error", "Email Exists");
          return response.redirect("/auth/signup");
        }
        response.send("error!!!");
      });
  }
);

router.get("/auth/signin", (request, response) => {
  response.render("auth/signin");
});

//home
router.get("/home", isLoggedIn, (request, response) => {
  // request.user
  User.find().then(users => {
    response.render("home", { users });
  });
});

//-- Login Route
router.post(
  "/auth/signin",
  passport.authenticate("local", {
    successRedirect: "/home", //after login success
    failureRedirect: "/auth/signin", //if fail
    failureFlash: "Invalid Username or Password",
    successFlash: "You have logged In!"
  })
);


//--- Logout Route
router.get("/auth/logout", (request, response) => {
  request.logout(); //clear and break session
  request.flash("success", "Dont leave please come back!");
  response.redirect("/auth/signin");
});


module.exports = router;