// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const utilities = require("../utilities/")
const classificationValidate = require('../utilities/classification-validation')
const inventoryValidate = require('../utilities/inventory-validation')
const accountType = require("../utilities/account-type")

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build inventory item detail view
router.get("/detail/:invId", invController.buildByInvId);

//Route to build inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));


// Route to add new classification view
router.get("/add-classification", accountType.checkEmployee, utilities.handleErrors(invController.buildAddClassification));

// Route to post new classification data
router.post(
  "/add-classification",accountType.checkEmployee,
  classificationValidate.classificationRules(),
  classificationValidate.checkClassificationData,
  utilities.handleErrors(invController.addNewClassification)
)

// route to add new inventory item view
router.get("/add-inventory", accountType.checkEmployee, utilities.handleErrors(invController.buildAddInventory));

//Route to post the new inventory item data
router.post("/add-inventory", accountType.checkEmployee,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkInventoryData,
  utilities.handleErrors(invController.addNewInventoryItem))


// Route to get inventory items based on classification_id and return as JSON
router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))


//Route to  build edit inventory item 
router.get("/edit/:invId",accountType.checkEmployee, utilities.handleErrors(invController.editInventoryView));

//Route to post the updated inventory item data
router.post("/update/", accountType.checkEmployee,
  inventoryValidate.inventoryRules(),
  inventoryValidate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory))
//Route to deliver the delete confirmation view
router.get("/delete/:invId",accountType.checkEmployee, utilities.handleErrors(invController.deleteView));

//Route to post the delete inventory request
router.post("/delete",accountType.checkEmployee, utilities.handleErrors(invController.deleteItem))

module.exports = router;


