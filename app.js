require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT;

const routes = require("./controllers/routes");
app.use(express.json());
app.use(express.urlencoded());
app.use("/routes", routes);
app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
