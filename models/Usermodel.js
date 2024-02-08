const Sequelize = require("sequelize");
const db = require("../config/config");

const UserModel = db.define(
  "Users",
  {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true,
    },
    FName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    LName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    Email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    Password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

UserModel.sync({ force: false })
  .then(() => {
    console.log("Table Created");
  })
  .catch((err) => {
    console.log(err.message);
  });

module.exports = UserModel;
