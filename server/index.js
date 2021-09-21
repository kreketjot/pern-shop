require('dotenv').config();
const express = require('express');
const cors = require('cors');
const models = require('./models/models');
const sequelize = require('./db');

const PORT = process.env.PORT || 5000;

const app = express();
app.use(cors());
app.use(express.json());

const start = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync();
    app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
  } catch (error) {
    console.error(error);
  }
};

start();
