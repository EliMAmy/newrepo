// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidate = require('../utilities/classification-validation')
const inventoryValidate = require('../utilities/inventory-validation')


// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build inventory item detail view
router.get("/detail/:invId", invController.buildByInvId);

//Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));


// Route to add new classification view
router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification));

// Route to post new classification data
router.post(
  "/add-classification",
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addNewClassification)
)

// route to add new inventory item view
router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory));

//Route to post the new inventory item data
router.post("/add-inventory", 
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addNewInventoryItem))

module.exports = router;


