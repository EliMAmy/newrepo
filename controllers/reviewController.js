const reviewModel = require("../models/review-model")
const utilities = require("../utilities/")

/* ****************************************
 * Add New Review
 **************************************** */
async function addReview(req, res) {
  const { review_text, inv_id, account_id } = req.body

  const result = await reviewModel.addReview(
    review_text,
    inv_id,
    account_id
  )

  if (result.rowCount) {
    req.flash("notice", "Review successfully added.")
  } else {
    req.flash("notice", "Sorry, the review could not be added.")
  }

  return res.redirect(`/inv/detail/${inv_id}`)
}


/* ****************************************
 * Build Edit Review View
 **************************************** */
async function buildEditReviewView(req, res) {
  const review_id = parseInt(req.params.review_id)

  const nav = await utilities.getNav()
  const reviewData = await reviewModel.getReviewById(review_id)

  if (!reviewData.rows.length) {
    req.flash("notice", "Review not found.")
    return res.redirect("/account/management")
  }

  const review = reviewData.rows[0]

  // 🔒 Ensure only author can edit
  if (review.account_id !== req.session.accountData.account_id) {
    req.flash("notice", "You are not authorized to edit this review.")
    return res.redirect("/account/management")
  }

  res.render("reviews/edit-review", {
    title: `Edit ${review.inv_year} ${review.inv_make} ${review.inv_model} Review`,
    nav,
    errors: null,
    review_id: review.review_id,
    review_text: review.review_text,
    review_date: review.review_date,
    inv_id: review.inv_id
  })
}


/* ****************************************
 * Update Review
 **************************************** */
async function updateReview(req, res) {
  const { review_id, review_text, inv_id } = req.body

  const reviewData = await reviewModel.getReviewById(review_id)

  if (!reviewData.rows.length) {
    req.flash("notice", "Review not found.")
    return res.redirect("/account/management")
  }

  const review = reviewData.rows[0]

  // 🔒 Ensure only author can update
  if (review.account_id !== req.session.accountData.account_id) {
    req.flash("notice", "You are not authorized to update this review.")
    return res.redirect("/account/management")
  }

  const result = await reviewModel.updateReview(
    review_text,
    review_id
  )

  if (result.rowCount) {
    req.flash("notice", "Review successfully updated.")
  } else {
    req.flash("notice", "Update failed.")
  }

  return res.redirect("/account/management")
}

/* ****************************************
 * Build Delete Review View
 **************************************** */
async function buildDeleteReviewView(req, res, next) {
  const review_id = parseInt(req.params.review_id)
  const nav = await utilities.getNav()

  const reviewData = await reviewModel.getReviewById(review_id)

  if (!reviewData.rows.length) {
    req.flash("notice", "Review not found.")
    return res.redirect("/account/management")
  }

  const review = reviewData.rows[0]

  // 🔒 Ensure only author can delete
  if (review.account_id !== req.session.accountData.account_id) {
    req.flash("notice", "You are not authorized to delete this review.")
    return res.redirect("/account/management")
  }

  res.render("reviews/delete-review", {
    title: `Delete ${review.inv_year} ${review.inv_make} ${review.inv_model} Review`,
    nav,
    errors: null,
    review_id: review.review_id,
    review_text: review.review_text,
    review_date: review.review_date,
    inv_id: review.inv_id
  })
}

/* ****************************************
 * Delete Review
 **************************************** */
async function deleteReview(req, res, next) {
  const review_id = parseInt(req.body.review_id)

  const reviewData = await reviewModel.getReviewById(review_id)

  if (!reviewData.rows.length) {
    req.flash("notice", "Review not found.")
    return res.redirect("/account/management")
  }

  const review = reviewData.rows[0]

  // 🔒 Ensure only author can delete
  if (review.account_id !== req.session.accountData.account_id) {
    req.flash("notice", "You are not authorized to delete this review.")
    return res.redirect("/account/management")
  }

  const result = await reviewModel.deleteReview(review_id)

  if (result.rowCount) {
    req.flash("notice", "Review successfully deleted.")
  } else {
    req.flash("notice", "Delete failed.")
  }

  return res.redirect("/account/management")
}


module.exports = {
  addReview,
  buildEditReviewView,
  updateReview,
  buildDeleteReviewView,
  deleteReview
}