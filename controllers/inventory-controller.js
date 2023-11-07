const { json } = require("express");

const knex = require("knex")(require("../knexfile"));

const index = async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.json(data);
  } catch (err) {
    res.status(400).send(`Error retreiving Inventories: ${err}`);
  }
};

module.exports = {
  index,
};
