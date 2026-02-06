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
module.exports = invCont