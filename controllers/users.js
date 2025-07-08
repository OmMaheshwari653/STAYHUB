const User = require("../models/user.js");


// Signup get route 
module.exports.getSignup = (req,res) => {
    res.render("users/signup.ejs");
}

//Signup Post Route
module.exports.signup = async(req, res, next) => {
    try{
    let {username, email, password} = req.body;
    const newUser = new User({ email, username })
    const registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
        if(err){
            return next(err);
        }
         req.flash("success", "Welcome to Stayhub");
         res.redirect("/listings")
    });
    }catch(e){
        req.flash("error", e.message);
        res.redirect("/signup")
    }
}

//Login Get Route
module.exports.getLogin = (req, res) => {
    res.render("users/login.ejs");
}

// Login Post Route
module.exports.login = (req, res) => {
    req.flash("success", "Welcome back to StayHub!");
    let redirectUrl = res.locals.returnTo || "/listings";
    delete req.session.returnTo;
    res.redirect(redirectUrl);     
}

//Logout Route
module.exports.logout = (req, res, next) => {
    req.logout((err) => {
        if(err){
          return  next(err);
        }
        req.flash("success", "Logged Out Successfully");
        res.redirect("/listings");
    })
}