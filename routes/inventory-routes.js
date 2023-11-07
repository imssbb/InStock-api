const express = require("express");
const router = express.Router();

const inventoryController = require("../controllers/inventory-controller");

router.route("/").get(inventoryController.index);

module.exports = router;
