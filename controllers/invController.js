const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */

invCont.buildByClassificationId = async function (req, res, next) {
  try {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)

    if (!data || data.length === 0) {
      const err = new Error("Classification not found!")
      err.status = 404
      throw err
    }

    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name

    res.render("./inventory/classification", {
      title: className + " vehicles",
      nav,
      grid
    })
  } catch (err) {
    next(err) //  CLAVE
  }
}


/* ***************************
 *  Build inventory item detail view
 * ************************** */
invCont.buildByInvId = async function (req, res, next) {
  try {
    const inv_id = req.params.invId
    const data = await invModel.getInventoryByInvId(inv_id)

    if (!data || data.length === 0) {
      throw new Error("Vehicle not found!")
    }

    const detail = await utilities.buildVehicleDetail(data[0])
    let nav = await utilities.getNav()

    res.render("./inventory/detail", {
      title: data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model,
      nav,
      detail
    })
  } catch (err) {
    next(err) // esto ENVÍA el error al middleware global
  }
}
// Build inventory management view
invCont.buildManagementView = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    })
  } catch (err) {
    next(err)
  }     
}

//* ***************************
//*  Build add classification view
//* ************************** */
invCont.buildAddClassification = async function (req, res, next) {
  try {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
    })
  } catch (err) {
    next(err)
  }     
}

//* ***************************
//*process the new classification form submission
//* ************************** */
invCont.addNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const classifiResult = await invModel.addClassification(classification_name)
  if (classifiResult) {
    req.flash(
      "notice",
      `Congratulations, you\'ve added ${classification_name} as a new classification.`
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the addition of the new classification failed.")
    let nav = await utilities.getNav()
    res.status(501).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      errors: null,
      classification_name
    })
  } 
}

//* ***************************
//*  build  the classification list for the add inventory item view
//* ************************** */
invCont.buildAddInventory = async function (req, res, next) { 
  try {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null,
    })
  } catch (err) {
    next(err)
  }     
}
// Build process the new inventory item form 
invCont.addNewInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  const { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body   

  const newInventoryresult = await invModel.addInventoryItem(
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
  )

  if (newInventoryresult) {
    req.flash(
      "notice",
      `Congratulations, you've added a new vehicle.`
    )
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      errors: null
    })
  } else {
    req.flash("notice", "Sorry, the addition of the new vehicle failed.")
    //let nav = await utilities.getNav()
    const classificationList = await utilities.buildClassificationList()
    res.status(501).render("./inventory/add-inventory", {
      title: "Add New Vehicle",
      nav,
      classificationList,
      errors: null
    })
  }
}

module.exports = invCont