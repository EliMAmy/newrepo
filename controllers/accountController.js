const utilities = require("../utilities/index")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const reviewModel = require("../models/review-model")
require("dotenv").config()

/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Process Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_password
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}
/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.")
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    })
    return
  }
try {
    const passwordMatch = await bcrypt.compare(account_password, accountData.account_password)
    if (!passwordMatch) {
      req.flash("notice", "Please check your credentials and try again.")
      return res.status(400).render("account/login", {
        title: "Login",
        nav,
        errors: null,
        account_email,
      })
    }

    // Remove password before saving in session
    delete accountData.account_password

    // Store login info in session
    req.session.loggedin = true
    req.session.accountData = accountData

    //  JWT cookie
    const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    if (process.env.NODE_ENV === 'development') {
      res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
    } else {
      res.cookie("jwt", accessToken, { httpOnly: true, secure: true, maxAge: 3600 * 1000 })
    }

    return res.redirect("/account/")

  } catch (error) {
    console.error(error)
    return res.status(500).render("account/login", {
      title: "Login",
      nav,
      errors: [{ msg: "Server error. Please try again later." }],
      account_email,
    })
  }
}



 //*****************************************
 // Build Account Management View
 // *************************************** */  

async function buildManagement(req, res, next) {
  try {
    const account_id = req.session.accountData.account_id
    const reviews = await reviewModel.getReviewsByAccountId(account_id)
    let nav = await utilities.getNav()
    res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null,
      reviews
    })
  } catch (err) {
    next(err)
  }
}

// Build the update account information view
async function buildUpdateView(req, res, next) {
  try {
    let nav = await utilities.getNav()
    const account_id = req.params.account_id
    const accountData = await accountModel.getAccountById(account_id)
    res.render("account/update", {
      title: "Edit Account",
      nav,
      errors: null,
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email
    })
  } catch (err) {
    console.error(err)
    next(err)
  }
}

// Process the account update information
async function updateAccount(req, res, next) {
  try {
    const { account_firstname, account_lastname, account_email, account_id } = req.body
    const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id
    )
    if (updateResult) {
      req.flash("notice", "Congratulations, your information has been updated.")
      res.redirect("/account/")
    } else {
      req.flash("notice", "Sorry, the update failed.")
      res.status(501).render("account/update", {
        title: "Edit Account",
        nav: await utilities.getNav(),
        errors: null,
        accountData: req.body
      })
    }
  } catch (err) {
    next(err)
  }
}

// Process the account update password information
async function updatePassword(req, res, next) {
  try {
    const { account_password, account_id } = req.body
    const updateResult = await accountModel.updatePassword(
      account_password,
      account_id
    ) 
    if (updateResult) {
      req.flash("notice", "Password updated successfully.")
      res.redirect("/account/")
    }
      else {
      req.flash("notice", "Sorry, the password update failed.")
      res.status(501).render("account/update", {
        title: "Edit Account",
        nav: await utilities.getNav(),
        errors: null,
        accountData: req.body
      })
    }
  } catch (err) {
    next(err)
  }
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildManagement, buildUpdateView, updateAccount, updatePassword }