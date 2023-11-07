const knex = require('knex')(require('../knexfile'));

// Get All Warehouse Information
const index = async (_req, res) => {
  try {
    const data = await knex('warehouses');
    res.json(data);
  } catch (err) {
    res.status(400).send(`Error retreiving Warehouses: ${err}`);
  }
};

// Get Single Warehouse Information
const findOne = async (req, res) => {
  try {
    const data = await knex('warehouses').where({ id: req.params.id });

    if (data.length === 0) {
      return res
        .status(404)
        .json({ message: `Error retreieving warehouse:${req.params.id}` });
    }
    const warehouseData = data[0];
    res.status(200).json(warehouseData);
  } catch (err) {
    res.status(404).json({
      message: `Unable to retrieve warehouse data for warehouse with ID ${req.params.id}`,
    });
  }
};

module.exports = { index, findOne };
