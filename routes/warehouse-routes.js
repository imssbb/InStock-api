const express = require("express");
const router = express.Router();
const knex = require("knex")(require("../knexfile"));

router.get("/", async (_req, res) => {
  try {
    const data = await knex("warehouses");
    res.json(data);
  } catch (err) {
    res.status(400).send(`Error retreiving posts: ${err}`);
  }
});

module.exports = router;
