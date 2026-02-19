const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}
const accountModel = require("../models/account-model")

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */  
validate.loginRules = () => {
  return [
    // valid email is required and cannot already exist in the DB   
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid email is required.")
       .bail() // if this validation fails, stop running validations and return the error message
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty()
       .withMessage("Password does not meet requirements.")
        .bail() // if this validation fails, stop running validations and return the error message
      .isStrongPassword({
        minLength: 12,            
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
} 
 
/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.status(400).render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
  *  Registration Data Validation Rules
  * ********************************* */
  validate.registationRules = () => {
    return [
      // firstname is required and must be string
      body("account_firstname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a first name.")
        .bail() // if this validation fails, stop running validations and return the error message
        .isLength({ min: 1 })
        .withMessage("Please provide a first name."), // on error this message is sent.
  
      // lastname is required and must be string
      body("account_lastname")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a last name.")
        .bail() // if this validation fails, stop running validations and return the error message
        .isLength({ min: 2 })
        .withMessage("Please provide a last name."), // on error this message is sent.
  
      // valid email is required and cannot already exist in the DB
      body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid email is required.")
      .bail() // if this validation fails, stop running validations and return the error message
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      ,
  
      // password is required and must be strong password
      body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password does not meet requirements.")
        .bail() // if this validation fails, stop running validations and return the error message
        .isLength({ min: 3 })
        .isStrongPassword({
          minLength: 12,
          minLowercase: 1,
          minUppercase: 1,
          minNumbers: 1,
          minSymbols: 1,
        })
        .withMessage("Password does not meet requirements."),
    ]
  }

  /* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}
// Validation for updating account info (first, last, email)
validate.updateAccountRules = () => {
  return [
        // firstname is required and must be string
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name.")
      .bail() // if this validation fails, stop running validations and return the error message
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name.")
      .bail() // if this validation fails, stop running validations and return the error message
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .escape()
    .notEmpty()
    .withMessage("A valid email is required.")
    .bail() // if this validation fails, stop running validations and return the error message
    .isEmail()
    .normalizeEmail() ,// refer to validator.js docs
  ]
}

// Validation for updating account info (first, last, email)
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a first name."),
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("Please provide a last name."),
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .withMessage("A valid email is required.")
      .isEmail()
      .normalizeEmail()
  ];
};

// Validation for updating password only
validate.updatePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .notEmpty()
       .withMessage("Password does not meet requirements.")
        .bail() // if this validation fails, stop running validations and return the error message
      .isStrongPassword({
        minLength: 12,            
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}
  /* ******************************
 * Check update data and return errors or continue to registration
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/update", {
      errors,
      title: "Update Account",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

//Check password update data and return errors or continue to update
validate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    const accountData = await accountModel.getAccountById(account_id)
    const nav = await utilities.getNav()

    res.status(400).render("account/update", {
      errors,
      title: "Update Password",
      nav,
      accountData ,// form fields will stay populated except password
      account_id: accountData.account_id,
      account_firstname: accountData.account_firstname,
      account_lastname: accountData.account_lastname,
      account_email: accountData.account_email
    })
    return
  }   
  next()
} 

module.exports = validate