const jwt = require("jsonwebtoken")
const utilities = require(".") 

/**
 * Middleware to allow access only to Employees or Admins
 */
async function checkEmployee(req, res, next) {
  let nav = await utilities.getNav()
  try {
    const token = req.cookies.jwt

    if (!token) {
      req.flash("notice", "You must be logged in to view that page.")
      return res.status(401).render("account/login", { title: "Login", nav, errors: null })
    }

    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)

    // Check account type
    if (decoded.account_type !== "Employee" && decoded.account_type !== "Admin") {
      req.flash("notice", "You do not have permission to access that page.")
      return res.status(403).render("account/login", { title: "Login", nav, errors: null })
    }

    // Passed, attach decoded data to request for later use
    req.accountData = decoded
    next()

  } catch (error) {
    console.error("JWT error:", error.message)
    req.flash("notice", "You must be logged in to view that page.")
    res.status(401).render("account/login", { title: "Login", nav, errors: null })
  }
}

module.exports = { checkEmployee }