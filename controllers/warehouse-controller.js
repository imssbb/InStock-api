const knex = require('knex')(require('../knexfile'));
const validator = require('validator');

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

// Post/Create New Warehouse

function isValidEmail(email) {
  //   return va.includes('@'); // For a basic example, let's check if the email contains an @ symbol
  return validator.isEmail(email);
}

function isValidPhoneNumber(phoneNumber) {
  // Use the isMobilePhone function with specific locale and strictMode settings
  return validator.isMobilePhone(phoneNumber, 'en-US', { strictMode: false });
}

const add = async (req, res) => {
  if (
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_email
  ) {
    return res.status(400).json({
      message: 'Unsuccessful. Please provide missing information',
    });
  }

  if (!isValidEmail(req.body.contact_email)) {
    return res.status(400).json({ message: 'Invalid email address' });
  }

  if (!isValidPhoneNumber(req.body.contact_phone)) {
    return res.status(400).json({ message: 'Invalid phone number' });
  }
  try {
    const result = await knex('warehouses').insert(req.body);
    // console.log('req.body:', req.body);

    const newWarehouseId = result[0];
    const createWarehouse = await knex('warehouses').where({
      id: newWarehouseId,
    });
    res.status(201).json(createWarehouse);
  } catch (err) {
    res.status(500).json({
      message: `Unable to create new warehouse: ${err}`,
    });
  }
};

//Put/Edit Warehouse

// Delete Warehouse

module.exports = { index, findOne, add };
