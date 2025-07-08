const express = require("express")
const router = express.Router({mergeParams : true});
const wrapAsync = require("../utils/wrapAsync.js");  
const ExpressError = require("../utils/expressError.js");
const Review = require("../models/review.js");
const Listing = require("../models/listing.js");
const { validateReview, isLoggedIn, isReviewAuthor } = require("../middleware.js");
const ReviewController = require("../controllers/reviews.js");


//Reviews Post Route
router.post("/",
  isLoggedIn,
  validateReview, 
  wrapAsync(ReviewController.post));

//Reviews Delete Route
router.delete("/:reviewId",
  isLoggedIn,
  isReviewAuthor, 
  wrapAsync(ReviewController.delete))

module.exports = router;