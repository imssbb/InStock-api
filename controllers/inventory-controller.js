const knex = require("knex")(require("../knexfile"));

const index = async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.json(data);
  } catch (err) {
    res.status(400).send(`Error retreiving Inventories: ${err}`);
  }
};

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

const add = async (req, res) => {
  if (
    //works without warehouse_id: null atm; need to check if warehouse_id exists
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

  try {
    const result = await knex("inventories").insert(req.body);

    const newInventoryId = result[0];
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

const update = async (req, res) => {
  try {
    //for all fields?
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
