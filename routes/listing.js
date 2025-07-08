const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const { listingSchema } = require("../joi.js");
const Listing = require("../models/listing.js");
const passport = require("passport");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");
const ListingController = require("../controllers/listings.js");
const multer = require('multer');
const { storage } = require("../cloudConfig.js")
const upload = multer({ storage })

router.
route("/")
.get(wrapAsync(ListingController.index))
 .post(
  isLoggedIn,
  upload.single('listing[image]'),
  wrapAsync(ListingController.create));

 //New Route
 router.get("/new",
  isLoggedIn,
   wrapAsync(ListingController.new));

router
.route("/:id")
.get(wrapAsync(ListingController.show))
  .put(
  isLoggedIn,
  isOwner,
  upload.single('listing[image]'),
  validateListing,
   wrapAsync(ListingController.update))
   .delete(
  isLoggedIn,
  isOwner,
   wrapAsync(ListingController.delete))

 router.get("/:id/edit",
  isLoggedIn,
  isOwner,
  wrapAsync(ListingController.edit))

module.exports = router;