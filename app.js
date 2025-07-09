if(process.env.NODE_ENV != "production"){
require('dotenv').config();
}
const express = require("express"); 
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");  
const ExpressError = require("./utils/expressError.js");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const flash = require("connect-flash");
const passport =  require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

app.set("views", path.join(__dirname, "/views"));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodOverride("_method"));
app.use(express.urlencoded({extended : true}));
app.engine('ejs', ejsMate);


//mongoose setup start
const dbUrl = process.env.ATLAS_DB_URL
main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(dbUrl);
}
//mongoose setup finish

const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600,
});

store.on("error", () => {
    console.log("ERROR IN MONGO SESSION STORE", err);
})

const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    expires :  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    maxAge : 7 * 24 *60 * 60 *1000,
    httpOnly : true,
  }
}

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currUser = req.user;
  next();
})

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter)
app.use("/", userRouter)

// 404 handler
app.use((req, res, next) => {
  const err = new Error("PAGE Not Found");
  err.status = 404;
  next(err); // Forward to error handler
});

// Error handler
app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Something broke!";
  // res.status(status).send(message); 
  res.render('error.ejs', { err }); 
});

app.listen(3000, (req, res) => {
    console.log("app is listening on port");
});

