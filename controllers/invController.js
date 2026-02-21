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

    const reviewModel = require("../models/review-model")
    const reviews = await reviewModel.getReviewsByInventoryId(inv_id)

    if (!data || data.length === 0) {
      throw new Error("Vehicle not found!")
    }

    const detail = await utilities.buildVehicleDetail(data[0])
    let nav = await utilities.getNav()

    res.render("./inventory/detail", {
      title: data[0].inv_year + " " + data[0].inv_make + " " + data[0].inv_model,
      nav,
      detail,
      inv_id,
      reviews
    })
  } catch (err) {
    next(err) // esto ENVÍA el error al middleware global
  }
}
// Build inventory management view
invCont.buildManagementView = async function (req, res, next) {
  try {
   let nav = await utilities.getNav()
   const classificationSelect = await utilities.buildClassificationList()
   res.render("./inventory/management", {
  
      title: "Vehicle Management",
      nav,
      errors: null,
      classificationSelect,
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
    res.redirect("/inv/")
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
      inv_make: "",
      inv_model: "",
      inv_year: "",
      inv_description: "",
      inv_image: "",
      inv_thumbnail: "",
      inv_price: "",
      inv_miles: "",
      inv_color: "",
      classification_id: ""
    })
  } catch (err) {
    next(err)
  }     
}
// Build process the new inventory item form 
invCont.addNewInventoryItem = async function (req, res, next) {
  let nav = await utilities.getNav()
  let { inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id } = req.body
  // Set default image paths if empty
  if (!inv_image || inv_image.trim() === "") {
    inv_image = "/images/vehicles/no-image.png"
  }

  if (!inv_thumbnail || inv_thumbnail.trim() === "") {
    inv_thumbnail = "/images/vehicles/no-image-tn.png"
  }

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
    res.redirect("/inv/")
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

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
  const inv_id = parseInt(req.params.invId)
  let nav = await utilities.getNav()
  const data = await invModel.getInventoryByInvId(inv_id)
  const itemData = data[0]
  const classificationList = await utilities.buildClassificationList(itemData.classification_id)
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationList,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}
/* ***************************
 *  Update Inventory Data
 * ************************** */
invCont.updateInventory = async function (req, res, next) {
  let nav = await utilities.getNav()
  let {
    inv_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id,
  } = req.body

    // Set default image paths if empty
  if (!inv_image || inv_image.trim() === "") {
    inv_image = "/images/vehicles/no-image.png"
  }

  if (!inv_thumbnail || inv_thumbnail.trim() === "") {
    inv_thumbnail = "/images/vehicles/no-image-tn.png"
  }
  
  const updateResult = await invModel.updateInventory(
    inv_id,  
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
    classification_id
  )

  if (updateResult) {
    const itemName = updateResult.inv_make + " " + updateResult.inv_model
    req.flash("notice", `The ${itemName} was successfully updated.`)
    return res.redirect("/inv/")
  } else {
    const classificationSelect = await utilities.buildClassificationList(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    req.flash("notice", "Sorry, the insert failed.")
    res.status(501).render("inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classificationList: classificationSelect,
    errors: null,
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
  }
}

/* ***************************
 *  Build the delete confirmation view
 * ************************** */
invCont.deleteView = async function (req, res, next) {
  let nav = await utilities.getNav()
  const inv_id = parseInt(req.params.invId)
  const data = await invModel.getInventoryByInvId(inv_id)
    const itemData = data[0]
  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_price: itemData.inv_price,
  })
}

/* ***************************
 *  Process the delete inventory item request
 * ************************** */
invCont.deleteItem = async function (req, res, next) {
  try {
    const inv_id = parseInt(req.body.inv_id)

    const deleteResult = await invModel.deleteInventoryItem(inv_id)

    if (deleteResult > 0) {
      req.flash("notice", "The deletion was successful.")
      return res.redirect("/inv/")
    } else {
      req.flash("notice", "Sorry, the delete failed.")
      return res.redirect("/inv/delete/" + inv_id)
    }
  } catch (error) {
    next(error)
  }
}



module.exports = invCont