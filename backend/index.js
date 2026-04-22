require("dotenv").config();

const express = require("express");
const cors = require("cors");

const processSourceRoute = require("./routes/processSource");

const app = express();

app.use(cors());
app.use(express.json());

// 🔥 AQUÍ CONECTAS EL ROUTER
app.use("/api/ia", processSourceRoute);

// test
app.get("/api/ia/test", (req, res) => {
  res.send("OK IA");
});

app.listen(3001, () => {
  console.log("Backend corriendo en http://localhost:3001");
});