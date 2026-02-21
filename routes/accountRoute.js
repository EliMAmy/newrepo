// Needed Resources 
const express = require("express")
const router = new express.Router() 
const utilities = require("../utilities/")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')


//Build the account management view
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildManagement))
// Route to build login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Process the login request
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
  utilities.handleErrors(accountController.accountLogin)
)

// Route to build registration view
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)
 
// Logout route
router.get("/logout", (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error(err)
    }
    // Clear the JWT cookie
    res.clearCookie("jwt");
    res.redirect("/")
  })
})

//Route to build the account update view
router.get("/update/:account_id", utilities.checkLogin, utilities.handleErrors(accountController.buildUpdateView))


//Route to post the account update information
router.post("/update",utilities.checkLogin,
   regValidate.updateAccountRules(),
   regValidate.checkUpdateData,  
   utilities.handleErrors(accountController.updateAccount))

//Route to post the account update-password information
router.post("/update-password", utilities.checkLogin,
    regValidate.updatePasswordRules(),
    regValidate.checkPasswordData,
     utilities.handleErrors(accountController.updatePassword))

router.get(
  "/management",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
)

module.exports = router;
