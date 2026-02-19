const utilities = require(".")
  const { body, validationResult } = require("express-validator")
  const validate = {}

// Validation rules for inventory item data form
validate.inventoryRules = () => {
  return [
    // Make sure the item make is not empty and is a string with a minimum length of 3 characters
    body("inv_make")
      .trim()                           
        .escape()   
        .notEmpty()
        .withMessage("Please provide an item make.") // on error this message is sent.
        .bail() // if this validation fails, stop running validations and return the error message
        .isLength({ min: 3 })
        .withMessage("Item make must be at least 3 characters long."), // on error this message is sent.
    // Make sure the item model is not empty and is a string with a minimum length of 3 characters      
    body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide an item model.") // on error this message is sent.
        .bail() // if this validation fails, stop running validations and return the error message
        .isLength({ min: 3 })
        .withMessage("Item model must be at least 3 characters long."), // on error this message is sent.

    // Make sure the year is not empty and is a valid integer
    body("inv_year")
        .trim()     
        .escape()
        .notEmpty()
        .withMessage("Please provide a year.") // on error this message is sent.
        .bail() // if this validation fails, stop running validations and return the error message
        .isInt()
        .withMessage("Year must be a valid integer.") // on error this message is sent.
        .bail() // if this validation fails, stop running validations and return the error message
        .isLength({min:4, max:4})
        .withMessage("Year must be 4 digits."), // on error this message is sent.

    // Make sure the item description is not empty and is a string with a minimum length of 10 characters
    body("inv_description")     
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide an item description.") // on error this message is sent.
        .bail() // if this validation fails, stop running validations and return the error message
        .isLength({ min: 10 })
        .withMessage("Item description must be at least 10 characters long."), // on error this message is sent.  
    // Make sure the item image URL is not empty and is a valid URL
    body("inv_image")
        .optional({ checkFalsy: true })
        .trim(),
    // Make sure the item thumbnail URL is not empty and is a valid URL
    body("inv_thumbnail")
        .optional({ checkFalsy: true })
        .trim(),
    // Make sure the item price is not empty and is a valid decimal number
    body("inv_price")
        .trim()     
        .escape()
        .notEmpty()
        .withMessage("Please provide a price.") // on error this message is sent.
        .bail() // if this validation fails, stop running validations and return the error message
        .isDecimal()
        .withMessage("Please provide a valid price."), // on error this message is sent.

    // Make sure the item category is not empty and is a valid integer
    body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide miles.") // on error this message is sent.
        .bail() // if this validation fails, stop running validations and return the error message
        .isInt()
        .withMessage("Please provide a valid miles value."), // on error this message is sent.
    // make sure the item color is not empty and is a string with a minimum length of 3 characters
    body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .withMessage("Please provide a color.") // on error this message is sent.
        .bail() // if this validation fails, stop running validations and return the error message
        .isLength({ min: 3 })
        .withMessage("Please provide a valid color."), // on error this message is sent.
    // Make sure the classification ID is not empty and is a valid integer
    body("classification_id")
    .notEmpty()
    .withMessage("Please select a classification.") // on error this message is sent.
    .bail()
    .isInt()
    .withMessage("Invalid classification selection."),

  ]
}   

//* ******************************
// Check data and return errors or continue to add or update inventory item
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
    
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(req.body.classification_id)
        res.render("./inventory/add-inventory", {
            errors,
            title: "Add New Vehicle",
            nav,
            classificationList,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,              
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id: req.body.classification_id
        })
        return
    }
    next()
}

//* ******************************
// Check data and return errors  will be directed back to the edit view.
validate.checkUpdateData = async (req, res, next) => {
  const { inv_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id} = req.body
    
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
      const classificationList = await utilities.buildClassificationList(classification_id)
        res.render("./inventory/edit-inventory", {
            errors,
            title: "Edit Vehicle",
            nav,
            classificationList,
            inv_id,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,              
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id
        })
        return
    }
    next()
}


module.exports = validate