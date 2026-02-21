const { body, validationResult } = require("express-validator")

function reviewRules() {
  return [
    body("review_text")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Review must be at least 3 characters.")
  ]
}

async function checkReviewData(req, res, next) {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash("notice", "Please correct errors.In the review text.")
    return res.redirect("back")
  }
  next()
}

module.exports = { reviewRules, checkReviewData }