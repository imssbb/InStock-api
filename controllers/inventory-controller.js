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

module.exports = {
  index,
  findOne,
};
