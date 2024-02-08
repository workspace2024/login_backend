const { Sequelize } = require("sequelize");
const dotenv = require("dotenv");

dotenv.config();

const DB = process.env.DB;
const USER = process.env.USER;
const PASS = process.env.PASS;
const HOST = process.env.HOST;

const sequelize = new Sequelize(DB, USER, PASS, {
  host: HOST,
  dialect: "mysql",
  timezone: "+05:30",
});

module.exports = sequelize;
