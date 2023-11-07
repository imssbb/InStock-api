const knex = require("knex")(require("../knexfile"));
const router = require("express").Router();

router.get("/", async (_req, res) => {
  try {
    const data = await knex("inventories");
    res.json(data);
  } catch (err) {
    res.status(400).send(`Error retreiving posts: ${err}`);
  }
});
