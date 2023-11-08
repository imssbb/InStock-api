const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const warehouseRoutes = require("./routes/warehouse-routes");
const inventoryRoutes = require("./routes/inventory-routes");

app.use(cors());
app.use(express.json());
app.use("/warehouses", warehouseRoutes);
app.use("/inventories", inventoryRoutes);

const PORT = process.env.PORT || 5050;

// basic home route
app.get("/", (req, res) => {
  res.send("Welcome to Boyz API");
});

app.listen(PORT, () => {
  console.log(`running at http://localhost:${PORT}`);
});
