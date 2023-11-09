const knex = require("knex")(require("../knexfile"));

// Get All Inventories Information
const index = async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.json(data);
  } catch (err) {
    res.status(400).send(`Error retreiving Inventories: ${err}`);
  }
};

// Get Single Inventories Information
const findOne = async (req, res) => {
  try {
    const data = await knex("inventories").where({
      id: req.params.id,
    }); //getting users from database with id
    if (data.length === 0) {
      return res.status(404).json({
        message: `Error retrieving inventory ${req.params.id}`,
      });
    }
    const inventoryData = data[0];
    res.status(200).json(inventoryData);
  } catch (error) {
    res.status(404).json({
      message: `Unable to retrieve inventory data for inventory with ID ${req.params.id}`,
    });
  }
};

// Post/Create New Inventory
const add = async (req, res) => {
  if (
    !req.body.warehouse_id ||
    !req.body.item_name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status ||
    !req.body.quantity
  ) {
    return res.status(400).json({
      message: `Please provide all information for the inventory in the request`,
    });
  }

  const warehouse_id = req.body.warehouse_id;
  const existingWarehouse = await knex("inventories")
    .where({ warehouse_id })
    .first();
  if (!existingWarehouse) {
    return res.status(400).send("Warehouse not found.");
  }

  if (isNaN(req.body.quantity)) {
    return res.status(400).send("Invalid. Quantity must be a number.");
  }

  try {
    const result = await knex("inventories").insert(req.body);
    const newInventoryId = result[0]; //get the id of the inventory item we just created
    const createdInventory = await knex("inventories")
      .where({
        id: newInventoryId,
      })
      .first();
    res.status(201).json(createdInventory);
  } catch (error) {
    res
      .status(400)
      .json({ message: `Unable to create new inventory: ${error}` });
  }
};

//Put/Edit Inventory
const update = async (req, res) => {
  if (
    !req.body.warehouse_id ||
    !req.body.item_name ||
    !req.body.description ||
    !req.body.category ||
    !req.body.status ||
    !req.body.quantity
  ) {
    return res.status(400).json({
      message: `Please provide all information for the inventory in the request`,
    });
  }

  //error code - if warehouse not found
  const warehouse_id = req.body.warehouse_id;
  const existingWarehouse = await knex("warehouses")
    .where({ id: warehouse_id })
    .first();
  if (!existingWarehouse) {
    return res.status(400).send(`Warehouse ${warehouse_id} not found.`);
  }

  //error code - if quantity is not a number
  if (isNaN(req.body.quantity)) {
    return res.status(400).send("Invalid. Quantity must be a number.");
  }

  try {
    const inventoryUpdate = await knex("inventories")
      .where({ id: req.params.id })
      .update(req.body);
    if (inventoryUpdate === 0) {
      return res.status(404).json({
        message: `Inventory with ID ${req.params.id} not found`,
      });
    }

    const updatedInventory = await knex("inventories").where({
      id: req.params.id,
    });
    res.status(200).json(updatedInventory[0]);
  } catch (error) {
    res.status(400).json({
      message: `Unable to update inventory: ${error}`,
    });
  }
};

// Delete Inventory
const remove = async (req, res) => {
  try {
    const inventoryDeleted = await knex("inventories")
      .where({ id: req.params.id })
      .delete();

    if (inventoryDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Inventory with ID ${req.params.id} not found` });
    }

    res.sendStatus(204); //No Content response
  } catch (error) {
    res.status(400).json({
      message: `Unable to delete inventory: ${error}`,
    });
  }
};

module.exports = {
  index,
  findOne,
  add,
  update,
  remove,
};
