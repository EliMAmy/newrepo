const express = require("express")
const router = new express.Router()
const reviewController = require("../controllers/reviewController")
const utilities = require("../utilities/")
const reviewValidate = require("../utilities/review-validation")

router.post(
  "/add",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.addReview)
)

router.get(
  "/edit/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildEditReviewView)
)

router.post(
  "/update",
  utilities.checkLogin,
  reviewValidate.reviewRules(),
  reviewValidate.checkReviewData,
  utilities.handleErrors(reviewController.updateReview)
)

// Build delete confirmation view
router.get(
  "/delete/:review_id",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.buildDeleteReviewView)
)

// Process deletion
router.post(
  "/delete",
  utilities.checkLogin,
  utilities.handleErrors(reviewController.deleteReview)
)

module.exports = router