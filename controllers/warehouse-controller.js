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
  // Define regular expressions for allowed formats
  const formats = [
    /^\+\d{1,4}\s?\(\d{3}\)\s?\d{3}-\d{4}$/,
    /^1\s?\d{3}\s?\d{3}\s?\d{4}$/,
    /^\d{3}\s?\d{3}\s?\d{4}$/,
  ];

  // Check if the phoneNumber matches any of the allowed formats
  return formats.some((format) => format.test(phoneNumber));
}

const add = async (req, res) => {
  if (
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
    !req.body.contact_email
  ) {
    console.log('Missing information:', {
      warehouse_name: req.body.warehouse_name,
      address: req.body.address,
      city: req.body.city,
      country: req.body.country,
      contact_name: req.body.contact_name,
      contact_position: req.body.contact_position,
      contact_phone: req.body.contact_phone,
      contact_email: req.body.contact_email,
    });
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

const update = async (req, res) => {
  if (
    !req.body.warehouse_name ||
    !req.body.address ||
    !req.body.city ||
    !req.body.country ||
    !req.body.contact_name ||
    !req.body.contact_position ||
    !req.body.contact_phone ||
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
    const warehouseUpdated = await knex('warehouses')
      .where({ id: req.params.id })
      .update(req.body);

    if (warehouseUpdated === 0) {
      return res.status(404).json({
        message: `Warehouse with ID ${req.params.id} not found`,
      });
    }

    const updateWarehouse = await knex('warehouses').where({
      id: req.params.id,
    });
    res.status(200).json(updateWarehouse[0]);
  } catch (err) {}
};

// Delete Warehouse

const remove = async (req, res) => {
  try {
    const warehouseDeleted = await knex('warehouses')
      .where({ id: req.params.id })
      .delete();

    if (warehouseDeleted === 0) {
      return res
        .status(404)
        .json({ message: `Warehouse with ID ${req.params.id} not found` });
    }
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({
      message: `Unable to delete warehouse: ${err}`,
    });
  }
};

// Get Inventories for a Given Warehouse

const inventories = async (req, res) => {
  try {
    const inventories = await knex('warehouses')
      .join('inventories', 'inventories.warehouse_id', 'warehouses.id')
      .where({ warehouse_id: req.params.id });
    res.json(inventories);
  } catch (err) {
    res.json(err);
  }
};

module.exports = { index, findOne, add, update, remove, inventories };
