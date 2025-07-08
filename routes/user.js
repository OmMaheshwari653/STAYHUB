const express = require("express")
const router = express.Router({});
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const UserController = require("../controllers/users.js")

//Signup get route
router.get("/signup", UserController.getSignup);

//Signup post Route
router.post("/signup", wrapAsync(UserController.signup));

//Login Route
router.get("/login", UserController.getLogin);

//Login Post Route
router.post("/login",
    saveRedirectUrl,
     passport.authenticate("local", 
    {
     failureRedirect: '/login', 
     failureFlash: true 
     }), 
    UserController.login)

//Logout Route
router.get("/logout", UserController.logout)


module.exports = router;