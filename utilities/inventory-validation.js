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
        .isLength({ min: 3 })
        .withMessage("Please provide an item make."), // on error this message is sent.
    // Make sure the item model is not empty and is a string with a minimum length of 3 characters      
    body("inv_model")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide an item model."), // on error this message is sent.

    // Make sure the item description is not empty and is a string with a minimum length of 10 characters
    body("inv_description")     
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 10 })
        .withMessage("Please provide an item description."), // on error this message is sent.  
    // Make sure the item image URL is not empty and is a valid URL
    body("inv_image")
        .trim()
        .escape()
        .notEmpty()
        .isURL()
        .withMessage("Please provide a valid image URL."), // on error this message is sent.
    // Make sure the item thumbnail URL is not empty and is a valid URL
    body("inv_thumbnail")
        .trim()
        .escape()
        .notEmpty()
        .isURL()
        .withMessage("Please provide a valid thumbnail URL."), // on error this message is sent.    

    // Make sure the item price is not empty and is a valid decimal number
    body("inv_price")
        .trim()     
        .escape()
        .notEmpty()
        .isDecimal()
        .withMessage("Please provide a valid price."), // on error this message is sent.

    // Make sure the year is not empty and is a valid integer
    body("inv_year")
        .trim()     
        .escape()
        .notEmpty()
        .isInt()
        .isLength(4) // Ensure the year is 4 digits long
        .withMessage("Please provide a valid year."), // on error this message is sent.

    // Make sure the item category is not empty and is a valid integer
    body("inv_miles")
        .trim()
        .escape()
        .notEmpty()
        .isInt()
        .withMessage("Please provide a valid miles value."), // on error this message is sent.
    // make sure the item color is not empty and is a string with a minimum length of 3 characters
    body("inv_color")
        .trim()
        .escape()
        .notEmpty()
        .isLength({ min: 3 })
        .withMessage("Please provide a valid color."), // on error this message is sent.
  ]
}   

//* ******************************
// Check data and return errors or continue to add or update inventory item
validate.checkInventoryData = async (req, res, next) => {
  const { inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_year, inv_miles, inv_color } = req.body
    
    let errors = []
    errors = validationResult(req)
    if (!errors.isEmpty()) {
      let nav = await utilities.getNav()
        res.render("inventory/add-inventory", {
            errors,
            title: "Add Inventory",
            nav,
            inv_make,
            inv_model,
            inv_description,
            inv_image,              
            inv_thumbnail,
            inv_price,
            inv_year,
            inv_miles,
            inv_color
        })
        return
    }
    next()
}

module.exports = validate