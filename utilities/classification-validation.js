const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}





/* ******************************
*validation rules for new classification
* ***************************** */
validate.classificationRules = () => {

  return [
    body("classification_name")
      .trim()
      .matches(/^[A-Za-z0-9]+$/)
      .withMessage("Classification name cannot contain spaces or special characters.")
  ]
}

/* ******************************
*check data and return errors or continue to new classification
* ***************************** */
validate.checkClassificationData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)  
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("inventory/add-classification", { 
      errors,
      title: "Add New Classification",
      nav,  
      classification_name
    })
    return
  }
  next()
}
module.exports = validate